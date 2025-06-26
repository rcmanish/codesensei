import React, { useState } from 'react';
import { Upload, FileText, Code, AlertCircle, CheckCircle, Clock, BarChart3, Lightbulb } from 'lucide-react';
import Header from '../components/Header';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { CodeAnalyzer, ReviewResult } from '../utils/codeAnalyzer';

const CodeReview: React.FC = () => {
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'editor'>('editor');
  const [language, setLanguage] = useState('python');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        setFileName(file.name);
        
        // Auto-detect language from file extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension === 'py') {
          setLanguage('python');
        } else if (['js', 'jsx', 'ts', 'tsx'].includes(extension || '')) {
          setLanguage('javascript');
        }
        
        setActiveTab('editor');
        toast.success('File uploaded successfully!');
      };
      reader.readAsText(file);
    }
  };

  const analyzeCode = async () => {
    if (!code.trim()) {
      toast.error('Please provide code to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API processing time
    setTimeout(() => {
      try {
        const result = CodeAnalyzer.analyzeCode(code, language);
        setReviewResult(result);
        
        if (result.bugs.length === 0 && result.suggestions.length === 0) {
          toast.success('Excellent! No issues found in your code.');
        } else if (result.bugs.length === 0) {
          toast.success('Code analysis completed - only suggestions found!');
        } else {
          toast.success('Code analysis completed!');
        }
      } catch (error) {
        toast.error('Error analyzing code. Please try again.');
        console.error('Code analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityScoreText = (score: number) => {
    if (score >= 9) return 'Excellent';
    if (score >= 8) return 'Very Good';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Fair';
    if (score >= 5) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Code Review</h1>
          <p className="mt-2 text-gray-600">Upload your code or paste it below for intelligent analysis and feedback</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Code Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'editor'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Code className="w-4 h-4 inline mr-2" />
                    Code Editor
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'upload'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload File
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'upload' ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".py,.js,.jsx,.ts,.tsx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload a file or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supports .py, .js, .jsx, .ts, .tsx, .txt files
                      </p>
                    </label>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {fileName && (
                        <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <FileText className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm text-blue-800">{fileName}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Language:</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                        </select>
                      </div>
                    </div>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <Editor
                        height="400px"
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value || '')}
                        theme="vs-light"
                        options={{
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 14,
                          wordWrap: 'on',
                          lineNumbers: 'on',
                          folding: true,
                          bracketMatching: 'always'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={analyzeCode}
                    disabled={isAnalyzing || !code.trim()}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing Code...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Start AI Review
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            {reviewResult ? (
              <div className="space-y-6">
                {/* Quality Score */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Quality</h3>
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${getQualityScoreColor(reviewResult.qualityScore)}`}>
                      {reviewResult.qualityScore}/10
                    </div>
                    <div className={`text-sm font-medium mb-3 ${getQualityScoreColor(reviewResult.qualityScore)}`}>
                      {getQualityScoreText(reviewResult.qualityScore)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          reviewResult.qualityScore >= 8 ? 'bg-green-500' :
                          reviewResult.qualityScore >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${reviewResult.qualityScore * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Complexity Analysis */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Complexity Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Time Complexity:</span>
                      <span className="font-mono font-medium text-gray-900">{reviewResult.complexity.timeComplexity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Space Complexity:</span>
                      <span className="font-mono font-medium text-gray-900">{reviewResult.complexity.spaceComplexity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Efficiency Score:</span>
                      <span className="font-medium text-gray-900">{reviewResult.complexity.score}/10</span>
                    </div>
                  </div>
                </div>

                {/* Issues Found */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Issues Found ({reviewResult.bugs.length})
                  </h3>
                  {reviewResult.bugs.length === 0 ? (
                    <div className="text-center py-4">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <p className="text-sm text-green-600 font-medium">No issues detected!</p>
                      <p className="text-xs text-gray-500 mt-1">Your code looks clean</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviewResult.bugs.map((bug, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(bug.severity)}`}>
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Line {bug.line}: {bug.type}</p>
                              <p className="text-xs mt-1">{bug.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Suggestions ({reviewResult.suggestions.length})
                  </h3>
                  {reviewResult.suggestions.length === 0 ? (
                    <div className="text-center py-4">
                      <Lightbulb className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
                      <p className="text-sm text-gray-600">No suggestions at this time</p>
                      <p className="text-xs text-gray-500 mt-1">Your code follows good practices</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviewResult.suggestions.map((suggestion, index) => (
                        <div key={index} className="border-l-4 border-green-400 pl-4">
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{suggestion.category}</p>
                              <p className="text-xs text-gray-600 mt-1">{suggestion.message}</p>
                              <p className="text-xs text-green-600 mt-1 italic">💡 {suggestion.improvement}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Analysis</h3>
                <p className="text-sm text-gray-600">
                  Upload your code or paste it in the editor, then click "Start AI Review" to get intelligent feedback on:
                </p>
                <ul className="text-xs text-gray-500 mt-3 space-y-1">
                  <li>• Bug detection</li>
                  <li>• Performance optimization</li>
                  <li>• Code quality assessment</li>
                  <li>• Best practice suggestions</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodeReview;