'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Brain, RotateCcw, Star, HelpCircle, Clock } from 'lucide-react';
import type { QuizQuestion } from '@/types/api';

interface GeneratedQuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export default function GeneratedQuiz({ questions, onComplete }: GeneratedQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null);
  const [fillBlankAnswer, setFillBlankAnswer] = useState('');
  const [shortAnswer, setShortAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [startTime] = useState(Date.now());

  const question = questions[currentQuestion];

  if (!questions.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No quiz questions available for this content.</p>
      </div>
    );
  }

  const handleAnswerSelect = (answer: string | boolean) => {
    if (answeredQuestions.includes(currentQuestion)) return;
    
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    const isCorrect = checkAnswer(answer);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnsweredQuestions(prev => [...prev, currentQuestion]);
  };

  const handleFillBlankSubmit = () => {
    if (answeredQuestions.includes(currentQuestion)) return;
    
    setShowExplanation(true);
    const isCorrect = checkAnswer(fillBlankAnswer.trim());
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnsweredQuestions(prev => [...prev, currentQuestion]);
  };

  const handleShortAnswerSubmit = () => {
    if (answeredQuestions.includes(currentQuestion)) return;
    
    setShowExplanation(true);
    const isCorrect = checkAnswer(shortAnswer.trim());
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnsweredQuestions(prev => [...prev, currentQuestion]);
  };

  const checkAnswer = (answer: string | boolean) => {
    if (question.type === 'true-false') {
      return answer === question.correctAnswer;
    } else if (question.type === 'multiple-choice') {
      return answer === question.correctAnswer;
    } else if (question.type === 'fill-blank' || question.type === 'short-answer') {
      const userAnswer = (answer as string).toLowerCase().trim();
      const correctAnswer = (question.correctAnswer as string).toLowerCase().trim();
      return userAnswer === correctAnswer;
    }
    return false;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setFillBlankAnswer('');
      setShortAnswer('');
      setShowExplanation(false);
    } else {
      setIsComplete(true);
      onComplete?.(score, questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setFillBlankAnswer('');
    setShortAnswer('');
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
    setIsComplete(false);
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-600 bg-green-100 border-green-200';
      case 2: return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 3: return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const isAnswered = answeredQuestions.includes(currentQuestion);

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const grade = percentage >= 90 ? 'Excellent!' : percentage >= 70 ? 'Good Job!' : percentage >= 50 ? 'Not Bad!' : 'Keep Practicing!';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
          <p className="text-xl text-gray-600 mb-2">{grade}</p>
          <p className="text-lg text-gray-600 mb-6">
            You scored <span className="font-bold text-blue-600">{score}</span> out of <span className="font-bold">{questions.length}</span> ({percentage}%)
          </p>
          <div className="flex justify-center gap-1 mb-8">
            {Array.from({ length: 5 }, (_, i) => (
              <Star 
                key={i} 
                className={`w-8 h-8 ${i < Math.round((score / questions.length) * 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Knowledge Check</h3>
            <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
            Level {question.difficulty}
          </div>
          <div className="flex gap-1">
            {getDifficultyStars(question.difficulty)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4 leading-relaxed">{question.question}</h4>
        
        {/* Multiple Choice */}
        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  selectedAnswer === option
                    ? selectedAnswer === question.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : isAnswered && option === question.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:hover:border-gray-200 disabled:hover:bg-white'
                } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && option === question.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {isAnswered && selectedAnswer === option && option !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* True/False */}
        {question.type === 'true-false' && (
          <div className="flex gap-4">
            {[true, false].map((option) => (
              <button
                key={option.toString()}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`flex-1 p-4 rounded-lg border transition-all ${
                  selectedAnswer === option
                    ? selectedAnswer === question.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : isAnswered && option === question.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:hover:border-gray-200 disabled:hover:bg-white'
                } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  {option ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium">{option ? 'True' : 'False'}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Fill in the Blank */}
        {question.type === 'fill-blank' && (
          <div className="space-y-4">
            <input
              type="text"
              value={fillBlankAnswer}
              onChange={(e) => setFillBlankAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={isAnswered}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {!isAnswered && (
              <button
                onClick={handleFillBlankSubmit}
                disabled={!fillBlankAnswer.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            )}
          </div>
        )}

        {/* Short Answer */}
        {question.type === 'short-answer' && (
          <div className="space-y-4">
            <textarea
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={isAnswered}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[100px] resize-none"
            />
            {!isAnswered && (
              <button
                onClick={handleShortAnswerSubmit}
                disabled={!shortAnswer.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            )}
          </div>
        )}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-2">Explanation:</h5>
                <p className="text-blue-800">{question.explanation}</p>
                {(question.type === 'fill-blank' || question.type === 'short-answer') && (
                  <p className="text-blue-700 mt-2">
                    <strong>Correct answer:</strong> {question.correctAnswer as string}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {showExplanation && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Score: {score}/{answeredQuestions.length} • {Math.round((score / Math.max(answeredQuestions.length, 1)) * 100)}%
          </div>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </motion.div>
  );
} 