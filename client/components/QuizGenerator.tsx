'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, HelpCircle, Brain, Loader2, RefreshCw, Trophy, Target, Clock, BookOpen, Zap } from 'lucide-react';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-in-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answer,
      isCorrect,
    };

    setUserAnswers(prev => [...prev, newAnswer]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
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
  };

  const getCurrentAnswer = () => {
    return userAnswers.find(a => a.questionId === questions[currentQuestionIndex]?.id);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return <Target className="w-4 h-4" />;
      case 'true-false':
        return <CheckCircle className="w-4 h-4" />;
      case 'short-answer':
        return <BookOpen className="w-4 h-4" />;
      case 'fill-in-blank':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Knowledge Quiz</h2>
        </div>
        <p className="text-gray-600">Test your understanding of the generated content</p>
      </div>

      {/* Generate Quiz Button */}
      {!quizStarted && !isLoading && (
        <Card className="p-6 text-center space-y-4 border-2 border-dashed border-gray-300">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Ready to Test Your Knowledge?</h3>
          </div>
          <p className="text-gray-600">
            Generate a quiz based on: "<span className="font-medium text-blue-600">{prompt}</span>"
          </p>
          <Button 
            onClick={generateQuiz} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            <Brain className="w-4 h-4 mr-2" />
            Generate Quiz
          </Button>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Generating Quiz...</h3>
              <p className="text-gray-600">Creating questions based on your content</p>
            </div>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {/* Quiz Progress */}
      {quizStarted && !quizCompleted && questions.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatTime(timeSpent)}</span>
              </div>
            </div>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Quiz Question */}
      {quizStarted && !quizCompleted && questions.length > 0 && (
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Question Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge className={`px-3 py-1 ${getQuestionTypeColor(questions[currentQuestionIndex].type)}`}>
                  {getQuestionTypeIcon(questions[currentQuestionIndex].type)}
                  <span className="ml-1 capitalize">{questions[currentQuestionIndex].type.replace('-', ' ')}</span>
                </Badge>
                {questions[currentQuestionIndex].difficulty && (
                  <Badge className={`px-3 py-1 ${getDifficultyColor(questions[currentQuestionIndex].difficulty)}`}>
                    {questions[currentQuestionIndex].difficulty}
                  </Badge>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {questions[currentQuestionIndex].question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {questions[currentQuestionIndex].type === 'multiple-choice' && questions[currentQuestionIndex].options && (
                <div className="space-y-2">
                  {questions[currentQuestionIndex].options!.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start p-4 h-auto text-left hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      onClick={() => handleAnswer(option)}
                      disabled={!!getCurrentAnswer()}
                    >
                      <span className="font-medium text-blue-600 mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {questions[currentQuestionIndex].type === 'true-false' && (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 p-4 hover:bg-green-50 hover:border-green-300 transition-colors"
                    onClick={() => handleAnswer('true')}
                    disabled={!!getCurrentAnswer()}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    True
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 p-4 hover:bg-red-50 hover:border-red-300 transition-colors"
                    onClick={() => handleAnswer('false')}
                    disabled={!!getCurrentAnswer()}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    False
                  </Button>
                </div>
              )}

              {(questions[currentQuestionIndex].type === 'short-answer' || questions[currentQuestionIndex].type === 'fill-in-blank') && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !getCurrentAnswer()) {
                        handleAnswer(e.currentTarget.value);
                      }
                    }}
                    disabled={!!getCurrentAnswer()}
                  />
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input.value.trim()) {
                        handleAnswer(input.value.trim());
                      }
                    }}
                    disabled={!!getCurrentAnswer()}
                  >
                    Submit Answer
                  </Button>
                </div>
              )}
            </div>

            {/* Answer Feedback */}
            {showExplanation && getCurrentAnswer() && (
              <Card className={`p-4 ${getCurrentAnswer()?.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-3">
                  {getCurrentAnswer()?.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div className="space-y-2">
                    <h4 className={`font-semibold ${getCurrentAnswer()?.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {getCurrentAnswer()?.isCorrect ? 'Correct!' : 'Incorrect'}
                    </h4>
                    <p className="text-gray-700">{questions[currentQuestionIndex].explanation}</p>
                    {!getCurrentAnswer()?.isCorrect && (
                      <p className="text-sm text-gray-600">
                        <strong>Correct answer:</strong> {questions[currentQuestionIndex].correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Next Question Button */}
            {showExplanation && (
              <div className="flex justify-end">
                <Button
                  onClick={nextQuestion}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Quiz Completion */}
      {quizCompleted && (
        <Card className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Trophy className="w-16 h-16 text-yellow-500" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{score}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">Quiz Complete!</h3>
              <p className="text-gray-600">Great job testing your knowledge!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor()}`}>{score}/{questions.length}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor()}`}>
                  {Math.round((score / questions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatTime(timeSpent)}</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetQuiz}
                variant="outline"
                className="px-6 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Quiz
              </Button>
              <Button
                onClick={generateQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                <Brain className="w-4 h-4 mr-2" />
                Generate New Quiz
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 