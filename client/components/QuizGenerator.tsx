'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, HelpCircle, Brain, Loader2, RefreshCw, Trophy, Target, Clock, BookOpen, Zap, ArrowRight, GripVertical } from 'lucide-react';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-in-blank' | 'drag-drop' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  dragItems?: { id: string; text: string; correctOrder: number }[];
  matchPairs?: { left: string; right: string }[];
}

interface QuizResponse {
  questions: QuizQuestion[];
  totalQuestions: number;
}

interface QuizGeneratorProps {
  prompt: string;
  generatedContent: string;
  isVisible?: boolean;
}

interface UserAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  dragOrder?: string[];
  matchedPairs?: { left: string; right: string }[];
}

export default function QuizGenerator({ 
  prompt, 
  generatedContent, 
  isVisible = true 
}: QuizGeneratorProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [draggedItems, setDraggedItems] = useState<string[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Fill-in-blank specific state
  const [fillInBlanks, setFillInBlanks] = useState<{ [key: string]: string }>({});
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [draggedOption, setDraggedOption] = useState<string | null>(null);

  // Auto-generate quiz when content is available
  useEffect(() => {
    if (isVisible && generatedContent && prompt && !questions.length && !isLoading) {
      generateQuiz();
    }
  }, [isVisible, generatedContent, prompt]);

  // Initialize fill-in-blank options when question changes
  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestionIndex]?.type === 'fill-in-blank') {
      const currentQ = questions[currentQuestionIndex];
      console.log('Fill-in-blank question loaded:', currentQ);
      if (currentQ.options) {
        console.log('Setting available options:', currentQ.options);
        setAvailableOptions([...currentQ.options]);
        setFillInBlanks({});
      } else {
        console.warn('No options found for fill-in-blank question:', currentQ);
      }
    }
  }, [currentQuestionIndex, questions]);

  // Timer for tracking time spent on quiz
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && !quizCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizCompleted]);

  const generateQuiz = async () => {
    if (!prompt.trim() || !generatedContent.trim()) {
      setError('Prompt and generated content are required to generate quiz');
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setScore(0);
    setQuizStarted(false);
    setTimeSpent(0);

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          generatedContent,
          questionCount: 5,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data: QuizResponse = await response.json();
      setQuestions(data.questions);
      setQuizStarted(true);
      
      // Initialize drag items for first question if it's a drag-drop type
      if (data.questions[0]?.type === 'drag-drop' && data.questions[0].dragItems) {
        setDraggedItems(data.questions[0].dragItems.map(item => item.id).sort(() => Math.random() - 0.5));
      } else if (data.questions[0]?.type === 'fill-in-blank' && data.questions[0].options) {
        setAvailableOptions([...data.questions[0].options]);
        setFillInBlanks({});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string, dragOrder?: string[], matchedPairs?: { left: string; right: string }[]) => {
    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect = false;

    // Handle different question types
    if (currentQuestion.type === 'drag-drop' && dragOrder) {
      const correctOrder = currentQuestion.dragItems?.sort((a, b) => a.correctOrder - b.correctOrder).map(item => item.id) || [];
      isCorrect = JSON.stringify(dragOrder) === JSON.stringify(correctOrder);
    } else if (currentQuestion.type === 'matching' && matchedPairs) {
      const correctPairs = currentQuestion.matchPairs || [];
      isCorrect = correctPairs.every(pair => 
        matchedPairs.some(matched => matched.left === pair.left && matched.right === pair.right)
      );
    } else {
      isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    }
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answer,
      isCorrect,
      dragOrder,
      matchedPairs,
    };

    setUserAnswers(prev => [...prev, newAnswer]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowExplanation(true);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    
    const newOrder = [...draggedItems];
    const draggedIndex = newOrder.indexOf(draggedItemId);
    
    if (draggedIndex !== -1) {
      newOrder.splice(draggedIndex, 1);
    }
    newOrder.splice(index, 0, draggedItemId);
    
    setDraggedItems(newOrder);
    setDragOverIndex(null);
  };

  const handleDragSubmit = () => {
    handleAnswer('', draggedItems);
  };

  // Fill-in-blank drag and drop handlers
  const handleOptionDragStart = (e: React.DragEvent, option: string) => {
    e.dataTransfer.setData('text/plain', option);
    setDraggedOption(option);
  };

  const handleBlankDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleBlankDrop = (e: React.DragEvent, blankId: string) => {
    e.preventDefault();
    const option = e.dataTransfer.getData('text/plain');
    
    // Update the blank with the dropped option
    setFillInBlanks(prev => ({ ...prev, [blankId]: option }));
    
    // Remove the option from available options
    setAvailableOptions(prev => prev.filter(opt => opt !== option));
    setDraggedOption(null);
  };

  const removeFromBlank = (blankId: string) => {
    const removedOption = fillInBlanks[blankId];
    if (removedOption) {
      // Add back to available options
      setAvailableOptions(prev => [...prev, removedOption]);
      // Remove from blank
      setFillInBlanks(prev => {
        const newBlanks = { ...prev };
        delete newBlanks[blankId];
        return newBlanks;
      });
    }
  };

  const submitFillInBlank = () => {
    const answer = Object.values(fillInBlanks).join(' ');
    handleAnswer(answer);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
      setDraggedItems([]);
      setDragOverIndex(null);
      setFillInBlanks({});
      setAvailableOptions([]);
      setDraggedOption(null);
      
      // Initialize drag items for next question if it's a drag-drop type
      const nextQ = questions[currentQuestionIndex + 1];
      if (nextQ?.type === 'drag-drop' && nextQ.dragItems) {
        setDraggedItems(nextQ.dragItems.map(item => item.id).sort(() => Math.random() - 0.5));
      } else if (nextQ?.type === 'fill-in-blank' && nextQ.options) {
        setAvailableOptions([...nextQ.options]);
      }
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setScore(0);
    setShowExplanation(false);
    setError(null);
    setQuizStarted(false);
    setTimeSpent(0);
    setDraggedItems([]);
    setDragOverIndex(null);
    setFillInBlanks({});
    setAvailableOptions([]);
    setDraggedOption(null);
  };

  const getCurrentAnswer = () => {
    return userAnswers.find(a => a.questionId === questions[currentQuestionIndex]?.id);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return <Target className="w-5 h-5 text-white" />;
      case 'true-false':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'short-answer':
        return <BookOpen className="w-5 h-5 text-white" />;
      case 'fill-in-blank':
        return <HelpCircle className="w-5 h-5 text-white" />;
      case 'drag-drop':
        return <GripVertical className="w-5 h-5 text-white" />;
      case 'matching':
        return <ArrowRight className="w-5 h-5 text-white" />;
      default:
        return <Brain className="w-5 h-5 text-white" />;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'true-false':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'short-answer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'fill-in-blank':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'drag-drop':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'matching':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Quiz Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Knowledge Quiz</h2>
          </div>
          <p className="text-gray-600">Test your understanding with interactive questions</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">Generating Quiz...</h3>
                <p className="text-gray-600">Creating personalized questions from your content</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 mb-6">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Quiz Progress Bar */}
        {quizStarted && !quizCompleted && questions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{formatTime(timeSpent)}</span>
                </div>
              </div>
              <span className="text-sm text-gray-600">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Quiz Questions - Horizontal Cards */}
        {quizStarted && !quizCompleted && questions.length > 0 && (
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div className="flex-shrink-0 w-full">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
                  {/* Question Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      {getQuestionTypeIcon(questions[currentQuestionIndex].type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{questions[currentQuestionIndex].question}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`px-2 py-1 text-xs ${getQuestionTypeColor(questions[currentQuestionIndex].type)}`}>
                          {questions[currentQuestionIndex].type.replace('-', ' ')}
                        </Badge>
                        {questions[currentQuestionIndex].difficulty && (
                          <Badge className={`px-2 py-1 text-xs ${getDifficultyColor(questions[currentQuestionIndex].difficulty)}`}>
                            {questions[currentQuestionIndex].difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Answer Section */}
                  <div className="space-y-4 mb-6">
                    {/* Multiple Choice */}
                    {questions[currentQuestionIndex].type === 'multiple-choice' && questions[currentQuestionIndex].options && (
                      <div className="grid gap-3">
                        {questions[currentQuestionIndex].options!.map((option, index) => (
                          <button
                            key={index}
                            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 flex items-center gap-3"
                            onClick={() => handleAnswer(option)}
                            disabled={!!getCurrentAnswer()}
                          >
                            <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-gray-700">{option}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* True/False */}
                    {questions[currentQuestionIndex].type === 'true-false' && (
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          className="p-6 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-3"
                          onClick={() => handleAnswer('true')}
                          disabled={!!getCurrentAnswer()}
                        >
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-gray-700">True</span>
                        </button>
                        <button
                          className="p-6 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 flex items-center justify-center gap-3"
                          onClick={() => handleAnswer('false')}
                          disabled={!!getCurrentAnswer()}
                        >
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-gray-700">False</span>
                        </button>
                      </div>
                    )}

                    {/* Drag and Drop */}
                    {questions[currentQuestionIndex].type === 'drag-drop' && questions[currentQuestionIndex].dragItems && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4">Drag the items below to arrange them in the correct order:</p>
                        <div className="grid gap-2 min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4">
                          {draggedItems.map((itemId, index) => {
                            const item = questions[currentQuestionIndex].dragItems?.find(d => d.id === itemId);
                            return (
                              <div
                                key={itemId}
                                draggable
                                onDragStart={(e) => handleDragStart(e, itemId)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`p-3 bg-white border rounded-lg cursor-move flex items-center gap-3 transition-all duration-200 ${
                                  dragOverIndex === index ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200'
                                }`}
                              >
                                <GripVertical className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">{item?.text}</span>
                              </div>
                            );
                          })}
                        </div>
                        {!getCurrentAnswer() && (
                          <button
                            onClick={handleDragSubmit}
                            className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                          >
                            Submit Order
                          </button>
                        )}
                      </div>
                    )}

                    {/* Enhanced Fill-in-Blank with Drag & Drop */}
                    {questions[currentQuestionIndex].type === 'fill-in-blank' && (
                      <div className="space-y-6">
                        {/* Question with Interactive Blanks */}
                        <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="text-lg leading-relaxed">
                            {(() => {
                              const questionText = questions[currentQuestionIndex].question;
                              const parts = questionText.split('_____');
                              
                              return parts.map((part, index) => (
                                <span key={index}>
                                  {part}
                                  {index < parts.length - 1 && (
                                    <span
                                      className={`inline-block min-w-[120px] mx-2 px-3 py-2 border-2 border-dashed rounded-lg transition-all duration-200 ${
                                        fillInBlanks[`blank-${index}`]
                                          ? 'bg-purple-100 border-purple-300 text-purple-800 cursor-pointer'
                                          : 'bg-white border-gray-300 hover:border-purple-400'
                                      }`}
                                      onDragOver={handleBlankDragOver}
                                      onDrop={(e) => handleBlankDrop(e, `blank-${index}`)}
                                      onClick={() => fillInBlanks[`blank-${index}`] && removeFromBlank(`blank-${index}`)}
                                      title={fillInBlanks[`blank-${index}`] ? 'Click to remove' : 'Drop an option here'}
                                    >
                                      {fillInBlanks[`blank-${index}`] || (
                                        <span className="text-gray-400 italic text-sm">Drop here</span>
                                      )}
                                    </span>
                                  )}
                                </span>
                              ));
                            })()}
                          </div>
                        </div>

                        {/* Draggable Options */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700 flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-gray-500" />
                            Drag the correct answer to the blank:
                          </h4>
                          <div className="flex flex-wrap gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            {(questions[currentQuestionIndex].options || []).filter(option => 
                              !Object.values(fillInBlanks).includes(option)
                            ).map((option, index) => (
                              <div
                                key={`${option}-${index}`}
                                draggable
                                onDragStart={(e) => handleOptionDragStart(e, option)}
                                className={`px-4 py-3 bg-white border-2 border-blue-300 rounded-lg cursor-move transition-all duration-200 hover:border-purple-400 hover:shadow-lg select-none transform hover:-translate-y-1 ${
                                  draggedOption === option ? 'opacity-50 scale-95' : 'hover:scale-105'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <GripVertical className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-800 font-medium">{option}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Status Messages */}
                          {questions[currentQuestionIndex].options && 
                           questions[currentQuestionIndex].options.filter(option => 
                             !Object.values(fillInBlanks).includes(option)
                           ).length === 0 && 
                           Object.keys(fillInBlanks).length > 0 && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <p className="text-sm text-green-700 font-medium">
                                All options have been used! Click on filled blanks to remove them if needed.
                              </p>
                            </div>
                          )}

                          {questions[currentQuestionIndex].options && 
                           questions[currentQuestionIndex].options.length === 0 && (
                            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <p className="text-sm text-yellow-700">
                                No options available for this question.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Submit Button */}
                        {Object.keys(fillInBlanks).length > 0 && !getCurrentAnswer() && (
                          <button
                            onClick={submitFillInBlank}
                            className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg transform hover:scale-105"
                          >
                            Submit Answer
                          </button>
                        )}
                        
                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-xs text-blue-700">
                            💡 Tip: Drag options to the blanks, or click filled blanks to remove them
                          </p>
                        </div>

                        {/* Debug Info (remove in production) */}
                        {process.env.NODE_ENV === 'development' && (
                          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                            <p><strong>Available Options:</strong> {JSON.stringify(questions[currentQuestionIndex].options)}</p>
                            <p><strong>Fill In Blanks:</strong> {JSON.stringify(fillInBlanks)}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Regular Text Input for Short Answer */}
                    {questions[currentQuestionIndex].type === 'short-answer' && (
                      <div className="space-y-3">
                        <textarea
                          placeholder="Type your answer here..."
                          className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          rows={3}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey && !getCurrentAnswer()) {
                              handleAnswer(e.currentTarget.value);
                            }
                          }}
                          disabled={!!getCurrentAnswer()}
                        />
                        <button
                          className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                          onClick={(e) => {
                            const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement;
                            if (textarea.value.trim()) {
                              handleAnswer(textarea.value.trim());
                            }
                          }}
                          disabled={!!getCurrentAnswer()}
                        >
                          Submit Answer
                        </button>
                        <p className="text-xs text-gray-500">Press Ctrl+Enter to submit quickly</p>
                      </div>
                    )}
                  </div>

                  {/* Answer Feedback */}
                  {showExplanation && getCurrentAnswer() && (
                    <div className={`p-4 rounded-lg mb-4 ${getCurrentAnswer()?.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="flex items-start gap-3">
                        {getCurrentAnswer()?.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div className="space-y-2">
                          <h4 className={`font-semibold ${getCurrentAnswer()?.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                            {getCurrentAnswer()?.isCorrect ? 'Excellent! That\'s correct!' : 'Not quite right'}
                          </h4>
                          <p className="text-gray-700 text-sm">{questions[currentQuestionIndex].explanation}</p>
                          {!getCurrentAnswer()?.isCorrect && (
                            <p className="text-sm text-gray-600">
                              <strong>Correct answer:</strong> {questions[currentQuestionIndex].correctAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next Question Button */}
                  {showExplanation && (
                    <div className="flex justify-end">
                      <button
                        onClick={nextQuestion}
                        className="text-purple-600 hover:text-purple-800 transition-colors font-medium text-sm flex items-center gap-2"
                      >
                        <span>{currentQuestionIndex < questions.length - 1 ? `Question ${currentQuestionIndex + 2}` : 'View Results'}</span>
                        <span>---&gt;</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Completion */}
        {quizCompleted && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Trophy className="w-20 h-20 text-yellow-500" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{score}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-gray-900">Quiz Complete!</h3>
                <p className="text-gray-600">Congratulations on completing the quiz!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-lg mx-auto">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className={`text-3xl font-bold ${getScoreColor()}`}>{score}/{questions.length}</div>
                  <div className="text-sm text-gray-600 font-medium">Score</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className={`text-3xl font-bold ${getScoreColor()}`}>
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Accuracy</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">{formatTime(timeSpent)}</div>
                  <div className="text-sm text-gray-600 font-medium">Time</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Quiz
                </button>
                <button
                  onClick={generateQuiz}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  New Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 