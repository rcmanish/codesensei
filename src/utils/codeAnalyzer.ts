interface CodeIssue {
  line: number;
  type: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

interface CodeSuggestion {
  category: string;
  message: string;
  improvement: string;
}

interface ComplexityAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  score: number;
}

export interface ReviewResult {
  bugs: CodeIssue[];
  suggestions: CodeSuggestion[];
  complexity: ComplexityAnalysis;
  qualityScore: number;
}

export class CodeAnalyzer {
  static analyzeCode(code: string, language: string = 'python'): ReviewResult {
    const lines = code.split('\n');
    const bugs: CodeIssue[] = [];
    const suggestions: CodeSuggestion[] = [];
    
    // Real code analysis based on actual patterns
    this.checkSyntaxIssues(lines, bugs, language);
    this.checkLogicIssues(lines, bugs, language);
    this.checkPerformanceIssues(lines, suggestions, language);
    this.checkCodeStyle(lines, suggestions, language);
    
    const complexity = this.analyzeComplexity(code, language);
    const qualityScore = this.calculateQualityScore(bugs, suggestions, complexity);
    
    return {
      bugs,
      suggestions,
      complexity,
      qualityScore
    };
  }

  private static checkSyntaxIssues(lines: string[], bugs: CodeIssue[], language: string) {
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (language === 'python') {
        // Check for common Python syntax issues
        if (trimmedLine.includes('print(') && !trimmedLine.includes(')')) {
          bugs.push({
            line: index + 1,
            type: 'Syntax Error',
            message: 'Unclosed parenthesis in print statement',
            severity: 'high'
          });
        }
        
        // Check for incorrect indentation patterns
        if (trimmedLine.startsWith('if ') && !trimmedLine.endsWith(':')) {
          bugs.push({
            line: index + 1,
            type: 'Syntax Error',
            message: 'Missing colon after if statement',
            severity: 'high'
          });
        }
        
        // Check for undefined variables (basic check)
        const varMatch = trimmedLine.match(/(\w+)\s*=/);
        if (varMatch && trimmedLine.includes(varMatch[1]) && trimmedLine.indexOf(varMatch[1]) === trimmedLine.lastIndexOf(varMatch[1])) {
          // Variable is only used once (defined but not used elsewhere)
          const nextLines = lines.slice(index + 1, Math.min(index + 10, lines.length));
          const isUsed = nextLines.some(nextLine => nextLine.includes(varMatch[1]));
          if (!isUsed && !trimmedLine.includes('return')) {
            bugs.push({
              line: index + 1,
              type: 'Logic Warning',
              message: `Variable '${varMatch[1]}' is defined but never used`,
              severity: 'low'
            });
          }
        }
      }
      
      if (language === 'javascript') {
        // Check for missing semicolons in JS
        if (trimmedLine.includes('let ') || trimmedLine.includes('const ') || trimmedLine.includes('var ')) {
          if (!trimmedLine.endsWith(';') && !trimmedLine.includes('{')) {
            bugs.push({
              line: index + 1,
              type: 'Style Warning',
              message: 'Missing semicolon',
              severity: 'low'
            });
          }
        }
        
        // Check for == vs ===
        if (trimmedLine.includes('==') && !trimmedLine.includes('===')) {
          bugs.push({
            line: index + 1,
            type: 'Best Practice',
            message: 'Use strict equality (===) instead of loose equality (==)',
            severity: 'medium'
          });
        }
      }
    });
  }

  private static checkLogicIssues(lines: string[], bugs: CodeIssue[], language: string) {
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check for potential null/undefined access
      if (trimmedLine.includes('.') && !trimmedLine.includes('if') && !trimmedLine.includes('try')) {
        const beforeDot = trimmedLine.split('.')[0].split(' ').pop();
        if (beforeDot && !['self', 'this', 'Math', 'console', 'JSON'].includes(beforeDot)) {
          // Look for null checks in previous lines
          const prevLines = lines.slice(Math.max(0, index - 5), index);
          const hasNullCheck = prevLines.some(prevLine => 
            prevLine.includes(beforeDot) && (prevLine.includes('null') || prevLine.includes('None') || prevLine.includes('undefined'))
          );
          
          if (!hasNullCheck) {
            bugs.push({
              line: index + 1,
              type: 'Logic Warning',
              message: `Potential null/undefined access on '${beforeDot}' - consider adding null check`,
              severity: 'medium'
            });
          }
        }
      }
      
      // Check for infinite loop potential
      if (trimmedLine.includes('while') && trimmedLine.includes('True')) {
        const nextLines = lines.slice(index + 1, Math.min(index + 10, lines.length));
        const hasBreak = nextLines.some(nextLine => nextLine.includes('break') || nextLine.includes('return'));
        if (!hasBreak) {
          bugs.push({
            line: index + 1,
            type: 'Logic Error',
            message: 'Potential infinite loop - no break or return statement found',
            severity: 'high'
          });
        }
      }
    });
  }

  private static checkPerformanceIssues(lines: string[], suggestions: CodeSuggestion[], language: string) {
    const codeText = lines.join('\n');
    
    // Check for nested loops
    const nestedLoopPattern = /for.*:\s*\n.*for.*:/g;
    if (nestedLoopPattern.test(codeText)) {
      suggestions.push({
        category: 'Performance',
        message: 'Nested loops detected - consider optimizing time complexity',
        improvement: 'Use hash maps or sets for O(1) lookups instead of nested iterations'
      });
    }
    
    // Check for repeated calculations
    lines.forEach((line, index) => {
      if (line.includes('len(') && lines.slice(index + 1).some(laterLine => laterLine.includes('len('))) {
        const lenMatch = line.match(/len\((\w+)\)/);
        if (lenMatch) {
          suggestions.push({
            category: 'Performance',
            message: 'Repeated length calculations detected',
            improvement: `Store len(${lenMatch[1]}) in a variable to avoid recalculation`
          });
        }
      }
    });
    
    // Check for string concatenation in loops
    let inLoop = false;
    lines.forEach((line, index) => {
      if (line.includes('for ') || line.includes('while ')) {
        inLoop = true;
      }
      if (inLoop && line.includes('+=') && line.includes('"')) {
        suggestions.push({
          category: 'Performance',
          message: 'String concatenation in loop detected',
          improvement: 'Use list.append() and join() for better performance with multiple string concatenations'
        });
      }
      if (line.trim() === '' && inLoop) {
        inLoop = false;
      }
    });
  }

  private static checkCodeStyle(lines: string[], suggestions: CodeSuggestion[], language: string) {
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check for long lines
      if (line.length > 100) {
        suggestions.push({
          category: 'Readability',
          message: `Line ${index + 1} is too long (${line.length} characters)`,
          improvement: 'Break long lines into multiple lines for better readability'
        });
      }
      
      // Check for magic numbers
      const numberMatch = trimmedLine.match(/\b(\d{2,})\b/);
      if (numberMatch && !['10', '100', '1000'].includes(numberMatch[1])) {
        suggestions.push({
          category: 'Maintainability',
          message: `Magic number '${numberMatch[1]}' found`,
          improvement: 'Consider using named constants for better code maintainability'
        });
      }
      
      // Check for meaningful variable names
      const varMatch = trimmedLine.match(/(\w+)\s*=/);
      if (varMatch && varMatch[1].length <= 2 && !['i', 'j', 'k', 'x', 'y', 'z'].includes(varMatch[1])) {
        suggestions.push({
          category: 'Readability',
          message: `Variable name '${varMatch[1]}' is too short`,
          improvement: 'Use descriptive variable names to improve code readability'
        });
      }
    });
  }

  private static analyzeComplexity(code: string, language: string): ComplexityAnalysis {
    const lines = code.split('\n');
    let timeComplexity = 'O(1)';
    let spaceComplexity = 'O(1)';
    let complexityScore = 10;
    
    // Analyze time complexity
    const forLoops = (code.match(/for\s+/g) || []).length;
    const whileLoops = (code.match(/while\s+/g) || []).length;
    const totalLoops = forLoops + whileLoops;
    
    if (totalLoops === 0) {
      timeComplexity = 'O(1)';
      complexityScore = 10;
    } else if (totalLoops === 1) {
      timeComplexity = 'O(n)';
      complexityScore = 8;
    } else if (totalLoops === 2) {
      // Check if nested
      const nestedPattern = /for.*:\s*\n.*for.*:/;
      if (nestedPattern.test(code)) {
        timeComplexity = 'O(n²)';
        complexityScore = 5;
      } else {
        timeComplexity = 'O(n)';
        complexityScore = 7;
      }
    } else {
      timeComplexity = 'O(n³)';
      complexityScore = 3;
    }
    
    // Analyze space complexity
    const arrayCreations = (code.match(/\[\]|\[.*\]|list\(|dict\(|set\(/g) || []).length;
    if (arrayCreations === 0) {
      spaceComplexity = 'O(1)';
    } else if (arrayCreations <= 2) {
      spaceComplexity = 'O(n)';
      complexityScore = Math.min(complexityScore, 8);
    } else {
      spaceComplexity = 'O(n²)';
      complexityScore = Math.min(complexityScore, 6);
    }
    
    return {
      timeComplexity,
      spaceComplexity,
      score: complexityScore
    };
  }

  private static calculateQualityScore(bugs: CodeIssue[], suggestions: CodeSuggestion[], complexity: ComplexityAnalysis): number {
    let score = 10;
    
    // Deduct points for bugs
    bugs.forEach(bug => {
      switch (bug.severity) {
        case 'high':
          score -= 2;
          break;
        case 'medium':
          score -= 1;
          break;
        case 'low':
          score -= 0.5;
          break;
      }
    });
    
    // Deduct points for suggestions
    score -= suggestions.length * 0.3;
    
    // Factor in complexity score
    score = (score + complexity.score) / 2;
    
    return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
  }
}