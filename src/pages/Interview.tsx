import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Send, Clock, CheckCircle, XCircle, Brain, Code2, HelpCircle } from 'lucide-react';
import Header from '../components/Header';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { getInterviewSet, CodingQuestion, TheoryQuestion, LogicalQuestion } from '../data/interviewQuestions';

interface InterviewSession {
  coding: CodingQuestion;
  theory: TheoryQuestion;
  logical: LogicalQuestion;
}

interface InterviewAnswers {
  codingAnswer: string;
  theoryAnswer: string;
  logicalAnswer: string;
}

interface EvaluationResult {
  codingScore: number;
  theoryScore: number;
  logicalScore: number;
  overallScore: number;
  feedback: {
    coding: string[];
    theory: string[];
    logical: string[];
  };
  testCasesPassed: number;
  totalTestCases: number;
}

const Interview: React.FC = () => {
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);
  const [answers, setAnswers] = useState<InterviewAnswers>({
    codingAnswer: '',
    theoryAnswer: '',
    logicalAnswer: ''
  });
  const [currentSection, setCurrentSection] = useState<'coding' | 'theory' | 'logical'>('coding');
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes total
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [language, setLanguage] = useState('python');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      toast.error('Time\'s up! Submitting your solutions...');
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startInterview = () => {
    const session = getInterviewSet();
    setInterviewSession(session);
    setAnswers({
      codingAnswer: session.coding.starterCode[language as keyof typeof session.coding.starterCode],
      theoryAnswer: '',
      logicalAnswer: ''
    });
    setCurrentSection('coding');
    setTimeLeft(45 * 60);
    setIsRunning(true);
    setShowResults(false);
    setEvaluationResult(null);
    toast.success('Technical interview started! Good luck!');
  };

  const pauseTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetInterview = () => {
    setInterviewSession(null);
    setAnswers({ codingAnswer: '', theoryAnswer: '', logicalAnswer: '' });
    setCurrentSection('coding');
    setTimeLeft(45 * 60);
    setIsRunning(false);
    setShowResults(false);
    setEvaluationResult(null);
  };

  const handleSubmit = async () => {
    if (!interviewSession) return;

    setIsSubmitting(true);
    setIsRunning(false);

    // Simulate comprehensive evaluation
    setTimeout(() => {
      const result = evaluateInterview();
      setEvaluationResult(result);
      setShowResults(true);
      setIsSubmitting(false);
      toast.success('Interview evaluation completed!');
    }, 3000);
  };

  const evaluateInterview = (): EvaluationResult => {
    if (!interviewSession) {
      return {
        codingScore: 0,
        theoryScore: 0,
        logicalScore: 0,
        overallScore: 0,
        feedback: { coding: [], theory: [], logical: [] },
        testCasesPassed: 0,
        totalTestCases: 0
      };
    }

    // Evaluate coding solution
    const codingScore = evaluateCodingSolution(answers.codingAnswer, interviewSession.coding);
    const theoryScore = evaluateTheoryAnswer(answers.theoryAnswer, interviewSession.theory);
    const logicalScore = evaluateLogicalAnswer(answers.logicalAnswer, interviewSession.logical);

    const overallScore = Math.round((codingScore + theoryScore + logicalScore) / 3 * 10) / 10;

    return {
      codingScore,
      theoryScore,
      logicalScore,
      overallScore,
      feedback: {
        coding: generateCodingFeedback(answers.codingAnswer, interviewSession.coding),
        theory: generateTheoryFeedback(answers.theoryAnswer, interviewSession.theory),
        logical: generateLogicalFeedback(answers.logicalAnswer, interviewSession.logical)
      },
      testCasesPassed: Math.floor(codingScore / 10 * interviewSession.coding.testCases.length),
      totalTestCases: interviewSession.coding.testCases.length
    };
  };

  const evaluateCodingSolution = (code: string, question: CodingQuestion): number => {
    if (!code.trim() || code === question.starterCode.python || code === question.starterCode.javascript) {
      return 0;
    }

    let score = 5; // Base score for attempting

    // Check for key algorithmic concepts
    if (question.title === "Two Sum") {
      if (code.includes('dict') || code.includes('{}') || code.includes('Map')) {
        score += 3; // Good approach using hash map
      }
      if (code.includes('enumerate') || code.includes('for') && code.includes('range')) {
        score += 2; // Shows understanding of iteration
      }
    }

    if (question.title === "Valid Parentheses") {
      if (code.includes('stack') || code.includes('[]') || code.includes('append') && code.includes('pop')) {
        score += 3; // Correct stack approach
      }
    }

    // Check for edge case handling
    if (code.includes('if') && (code.includes('null') || code.includes('None') || code.includes('empty'))) {
      score += 1;
    }

    // Check for proper return statements
    if (code.includes('return')) {
      score += 1;
    }

    return Math.min(10, score);
  };

  const evaluateTheoryAnswer = (answer: string, question: TheoryQuestion): number => {
    if (!answer.trim()) return 0;

    if (question.type === 'multiple-choice') {
      return answer.toLowerCase().includes(question.correctAnswer?.toLowerCase() || '') ? 10 : 2;
    }

    // For open-ended questions, check for key concepts
    const answerLower = answer.toLowerCase();
    const correctLower = question.correctAnswer?.toLowerCase() || '';
    
    let score = 2; // Base score for attempting

    // Check for key terms
    const keyTerms = correctLower.split(' ').filter(word => word.length > 3);
    const matchedTerms = keyTerms.filter(term => answerLower.includes(term));
    score += (matchedTerms.length / keyTerms.length) * 6;

    // Bonus for comprehensive answers
    if (answer.length > 100) score += 2;

    return Math.min(10, Math.round(score));
  };

  const evaluateLogicalAnswer = (answer: string, question: LogicalQuestion): number => {
    if (!answer.trim()) return 0;

    const answerLower = answer.toLowerCase();
    const correctLower = question.answer.toLowerCase();

    // Check for key concepts in the answer
    const keyPhrases = correctLower.split('.').map(phrase => phrase.trim());
    let score = 2; // Base score

    keyPhrases.forEach(phrase => {
      if (phrase.length > 10 && answerLower.includes(phrase.substring(0, 15))) {
        score += 2;
      }
    });

    // Check for specific numbers or solutions
    const numbers = correctLower.match(/\d+/g);
    if (numbers) {
      numbers.forEach(num => {
        if (answerLower.includes(num)) score += 1;
      });
    }

    return Math.min(10, score);
  };

  const generateCodingFeedback = (code: string, question: CodingQuestion): string[] => {
    const feedback: string[] = [];

    if (!code.trim() || code === question.starterCode.python || code === question.starterCode.javascript) {
      feedback.push("❌ No solution provided");
      return feedback;
    }

    feedback.push("✅ Solution attempt submitted");

    if (question.title === "Two Sum" && (code.includes('dict') || code.includes('Map'))) {
      feedback.push("✅ Excellent use of hash map for O(n) solution");
    } else if (question.title === "Two Sum") {
      feedback.push("💡 Consider using a hash map for better time complexity");
    }

    if (code.includes('return')) {
      feedback.push("✅ Proper return statement included");
    }

    if (code.includes('if') && (code.includes('null') || code.includes('None'))) {
      feedback.push("✅ Good edge case handling");
    } else {
      feedback.push("💡 Consider adding edge case validation");
    }

    return feedback;
  };

  const generateTheoryFeedback = (answer: string, question: TheoryQuestion): string[] => {
    const feedback: string[] = [];

    if (!answer.trim()) {
      feedback.push("❌ No answer provided");
      return feedback;
    }

    if (question.type === 'multiple-choice') {
      if (answer.toLowerCase().includes(question.correctAnswer?.toLowerCase() || '')) {
        feedback.push("✅ Correct answer selected");
      } else {
        feedback.push("❌ Incorrect answer");
        feedback.push(`💡 Correct answer: ${question.correctAnswer}`);
      }
    } else {
      feedback.push("✅ Answer provided");
      if (answer.length > 50) {
        feedback.push("✅ Comprehensive explanation");
      } else {
        feedback.push("💡 Could provide more detailed explanation");
      }
    }

    return feedback;
  };

  const generateLogicalFeedback = (answer: string, question: LogicalQuestion): string[] => {
    const feedback: string[] = [];

    if (!answer.trim()) {
      feedback.push("❌ No answer provided");
      return feedback;
    }

    feedback.push("✅ Solution attempt provided");

    if (answer.length > 100) {
      feedback.push("✅ Detailed reasoning provided");
    } else {
      feedback.push("💡 Could provide more detailed step-by-step reasoning");
    }

    return feedback;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'coding': return <Code2 className="w-5 h-5" />;
      case 'theory': return <Brain className="w-5 h-5" />;
      case 'logical': return <HelpCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  if (!interviewSession) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Technical Interview</h1>
            <p className="mt-2 text-gray-600">Complete technical interview simulation with coding, theory, and logical reasoning</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <Clock className="mx-auto h-16 w-16 text-blue-600 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready for Your Technical Interview?</h2>
              <p className="text-gray-600 mb-6">
                This comprehensive interview includes three sections:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Code2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Coding Problem</h3>
                  <p className="text-sm text-gray-600 mt-1">Solve algorithmic challenges</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <Brain className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Theory Questions</h3>
                  <p className="text-sm text-gray-600 mt-1">Computer science concepts</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <HelpCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Logic Puzzles</h3>
                  <p className="text-sm text-gray-600 mt-1">Problem-solving skills</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Time Limit:</strong> 45 minutes total • <strong>Format:</strong> Mixed questions • <strong>Evaluation:</strong> Comprehensive scoring
                </p>
              </div>

              <button
                onClick={startInterview}
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Play className="w-6 h-6 mr-3" />
                Start Technical Interview
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Timer and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Technical Interview</h1>
              <div className="flex space-x-1">
                {(['coding', 'theory', 'logical'] as const).map((section) => (
                  <button
                    key={section}
                    onClick={() => setCurrentSection(section)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                      currentSection === section
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {getSectionIcon(section)}
                    <span className="capitalize">{section}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`text-lg font-mono font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={pauseTimer}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={resetInterview}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {!showResults ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Question Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {currentSection === 'coding' && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">{interviewSession.coding.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(interviewSession.coding.difficulty)}`}>
                        {interviewSession.coding.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-700">{interviewSession.coding.description}</p>
                  </div>
                  
                  <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Examples:</h3>
                        {interviewSession.coding.examples.map((example, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md mb-3">
                            <p className="text-sm font-mono text-gray-700">
                              <strong>Input:</strong> {example.input}
                            </p>
                            <p className="text-sm font-mono text-gray-700">
                              <strong>Output:</strong> {example.output}
                            </p>
                            {example.explanation && (
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Explanation:</strong> {example.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Constraints:</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {interviewSession.coding.constraints.map((constraint, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              {constraint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentSection === 'theory' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Theory Question</h2>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-800">{interviewSession.theory.question}</p>
                  </div>
                  
                  {interviewSession.theory.type === 'multiple-choice' && interviewSession.theory.options && (
                    <div className="space-y-2">
                      <p className="font-medium text-gray-700">Select the correct answer:</p>
                      {interviewSession.theory.options.map((option, index) => (
                        <label key={index} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="theory-answer"
                            value={option}
                            onChange={(e) => setAnswers(prev => ({ ...prev, theoryAnswer: e.target.value }))}
                            className="text-blue-600"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentSection === 'logical' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Logic Puzzle</h2>
                  <div className="bg-purple-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-800">{interviewSession.logical.question}</p>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Suggested time: {interviewSession.logical.timeLimit} minutes
                  </div>
                </div>
              )}
            </div>

            {/* Answer Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Your Answer</h3>
              </div>
              
              <div className="p-4">
                {currentSection === 'coding' ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-700">Language:</label>
                      <select
                        value={language}
                        onChange={(e) => {
                          setLanguage(e.target.value);
                          setAnswers(prev => ({
                            ...prev,
                            codingAnswer: interviewSession.coding.starterCode[e.target.value as keyof typeof interviewSession.coding.starterCode]
                          }));
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                      </select>
                    </div>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <Editor
                        height="400px"
                        language={language}
                        value={answers.codingAnswer}
                        onChange={(value) => setAnswers(prev => ({ ...prev, codingAnswer: value || '' }))}
                        theme="vs-light"
                        options={{
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 14,
                          wordWrap: 'on'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={currentSection === 'theory' ? answers.theoryAnswer : answers.logicalAnswer}
                    onChange={(e) => setAnswers(prev => ({
                      ...prev,
                      [currentSection === 'theory' ? 'theoryAnswer' : 'logicalAnswer']: e.target.value
                    }))}
                    placeholder={`Enter your ${currentSection} answer here...`}
                    className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Interview Results</h2>
            
            {evaluationResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{evaluationResult.overallScore}/10</div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{evaluationResult.codingScore}/10</div>
                    <div className="text-sm text-gray-600">Coding</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{evaluationResult.theoryScore}/10</div>
                    <div className="text-sm text-gray-600">Theory</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{evaluationResult.logicalScore}/10</div>
                    <div className="text-sm text-gray-600">Logic</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(['coding', 'theory', 'logical'] as const).map((section) => (
                    <div key={section} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 capitalize flex items-center">
                        {getSectionIcon(section)}
                        <span className="ml-2">{section} Feedback</span>
                      </h3>
                      <div className="space-y-2">
                        {evaluationResult.feedback[section].map((item, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            {item.startsWith('✅') ? (
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : item.startsWith('❌') ? (
                              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <div className="w-4 h-4 bg-yellow-400 rounded-full flex-shrink-0 mt-0.5" />
                            )}
                            <span className="text-sm text-gray-700">{item.substring(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        {!showResults && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Evaluating Interview...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Interview
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Interview;