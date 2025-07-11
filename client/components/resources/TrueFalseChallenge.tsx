'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Brain, Star, Zap, BookOpen, Calculator, Atom, Globe, Code } from 'lucide-react';

interface Question {
  id: string;
  category: string;
  question: string;
  answer: boolean;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: JSX.Element;
}

const questions: Question[] = [
  // Math Questions
  {
    id: 'math1',
    category: 'Mathematics',
    question: 'The square root of 64 is 8',
    answer: true,
    explanation: '√64 = 8 because 8 × 8 = 64',
    difficulty: 'easy',
    icon: <Calculator className="h-5 w-5" />
  },
  {
    id: 'math2',
    category: 'Mathematics',
    question: 'All prime numbers are odd',
    answer: false,
    explanation: 'The number 2 is a prime number and it is even',
    difficulty: 'medium',
    icon: <Calculator className="h-5 w-5" />
  },
  // Science Questions
  {
    id: 'science1',
    category: 'Science',
    question: 'Water boils at 100°C at sea level',
    answer: true,
    explanation: 'At standard atmospheric pressure (1 atm), water boils at exactly 100°C',
    difficulty: 'easy',
    icon: <Atom className="h-5 w-5" />
  },
  {
    id: 'science2',
    category: 'Science',
    question: 'Sound travels faster than light',
    answer: false,
    explanation: 'Light travels at ~300,000,000 m/s while sound travels at ~343 m/s in air',
    difficulty: 'easy',
    icon: <Atom className="h-5 w-5" />
  },
  // Technology Questions
  {
    id: 'tech1',
    category: 'Technology',
    question: 'AI stands for Artificial Intelligence',
    answer: true,
    explanation: 'AI is the abbreviation for Artificial Intelligence',
    difficulty: 'easy',
    icon: <Code className="h-5 w-5" />
  },
  {
    id: 'tech2',
    category: 'Technology',
    question: 'HTML is a programming language',
    answer: false,
    explanation: 'HTML is a markup language, not a programming language',
    difficulty: 'medium',
    icon: <Code className="h-5 w-5" />
  },
  // Geography Questions
  {
    id: 'geo1',
    category: 'Geography',
    question: 'The Pacific Ocean is the largest ocean on Earth',
    answer: true,
    explanation: 'The Pacific Ocean covers about 46% of the water surface and 32% of Earth\'s surface',
    difficulty: 'easy',
    icon: <Globe className="h-5 w-5" />
  },
  {
    id: 'geo2',
    category: 'Geography',
    question: 'Australia is both a country and a continent',
    answer: true,
    explanation: 'Australia is unique as it is both a sovereign country and a continent',
    difficulty: 'medium',
    icon: <Globe className="h-5 w-5" />
  },
  // Logic Questions
  {
    id: 'logic1',
    category: 'Logic',
    question: 'If all roses are flowers, and some flowers are red, then all roses are red',
    answer: false,
    explanation: 'This is a logical fallacy. While all roses are flowers, not all roses are red',
    difficulty: 'hard',
    icon: <Brain className="h-5 w-5" />
  },
  {
    id: 'logic2',
    category: 'Logic',
    question: 'In Boolean logic, True AND False equals False',
    answer: true,
    explanation: 'In Boolean algebra, AND operation returns True only when both operands are True',
    difficulty: 'medium',
    icon: <Brain className="h-5 w-5" />
  }
];

export default function TrueFalseChallenge() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<{[key: string]: boolean}>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.answer;

  const handleAnswer = (answer: boolean) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answer);
    setIsAnimating(true);
    
    setTimeout(() => {
      setShowExplanation(true);
      
      if (answer === currentQuestion.answer) {
        const points = currentQuestion.difficulty === 'easy' ? 10 : 
                      currentQuestion.difficulty === 'medium' ? 20 : 30;
        setScore(prev => prev + points + (streak * 5)); // Bonus for streak
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }
      
      setAnsweredQuestions(prev => ({
        ...prev,
        [currentQuestion.id]: answer === currentQuestion.answer
      }));
      
      setIsAnimating(false);
    }, 1000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Game completed
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-emerald-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'hard': return 'from-red-500 to-pink-600';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Mathematics': return 'bg-blue-100 text-blue-800';
      case 'Science': return 'bg-green-100 text-green-800';
      case 'Technology': return 'bg-purple-100 text-purple-800';
      case 'Geography': return 'bg-teal-100 text-teal-800';
      case 'Logic': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧠 True or False Challenge
          </h1>
          <p className="text-gray-600 text-lg">
            Test your knowledge across multiple subjects!
          </p>
          
          <div className="flex items-center justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-gray-700">Score: {score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-gray-700">Streak: {streak}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-700">
                {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          {/* Question Header */}
          <div className={`bg-gradient-to-r ${getDifficultyColor(currentQuestion.difficulty)} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  {currentQuestion.icon}
                </div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(currentQuestion.category)} bg-white/90`}>
                    {currentQuestion.category}
                  </span>
                  <div className="text-xs mt-1 text-white/80 capitalize">
                    {currentQuestion.difficulty} Level
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/80">Question</div>
                <div className="text-xl font-bold">{currentQuestionIndex + 1}</div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-8">
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-8 text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentQuestion.question}
            </motion.h2>

            {/* Answer Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.button
                whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(true)}
                disabled={showExplanation}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all duration-300 text-lg font-semibold
                  ${selectedAnswer === true 
                    ? (isCorrect ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                    : 'border-green-300 bg-green-50 text-green-700 hover:border-green-500 hover:bg-green-100'
                  }
                  ${showExplanation && selectedAnswer !== true ? 'opacity-50' : ''}
                `}
              >
                <div className="flex items-center justify-center gap-3">
                  <motion.div
                    animate={isAnimating && selectedAnswer === true ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Check className="h-8 w-8" />
                  </motion.div>
                  <span>TRUE</span>
                </div>
                
                {showExplanation && selectedAnswer === true && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg
                      ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {isCorrect ? '✓' : '✗'}
                  </motion.div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(false)}
                disabled={showExplanation}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all duration-300 text-lg font-semibold
                  ${selectedAnswer === false 
                    ? (isCorrect ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                    : 'border-red-300 bg-red-50 text-red-700 hover:border-red-500 hover:bg-red-100'
                  }
                  ${showExplanation && selectedAnswer !== false ? 'opacity-50' : ''}
                `}
              >
                <div className="flex items-center justify-center gap-3">
                  <motion.div
                    animate={isAnimating && selectedAnswer === false ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <X className="h-8 w-8" />
                  </motion.div>
                  <span>FALSE</span>
                </div>
                
                {showExplanation && selectedAnswer === false && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg
                      ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {isCorrect ? '✓' : '✗'}
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-6 rounded-2xl mb-6 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isCorrect ? 'bg-green-200' : 'bg-orange-200'}`}>
                      {isCorrect ? 
                        <Check className="h-5 w-5 text-green-700" /> : 
                        <Brain className="h-5 w-5 text-orange-700" />
                      }
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-2 ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                        {isCorrect ? 'Correct!' : 'Not quite right'}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                      {isCorrect && streak > 1 && (
                        <div className="mt-2 text-sm text-green-600 font-semibold">
                          🔥 {streak} question streak! +{streak * 5} bonus points!
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            {showExplanation && (
              <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextQuestion}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Restart Challenge'}
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-2"
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="bg-white rounded-xl p-4 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {Object.keys(answeredQuestions).length}/{questions.length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(Object.keys(answeredQuestions).length / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 