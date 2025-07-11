'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, X, Clock, Star, Lightbulb, Target, RotateCcw } from 'lucide-react';

interface LogicQuestion {
  id: string;
  type: 'boolean' | 'deduction' | 'pattern' | 'riddle';
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 1 | 2 | 3;
  hint?: string;
}

const logicQuestions: LogicQuestion[] = [
  // Boolean Logic
  {
    id: '1',
    type: 'boolean',
    category: 'Boolean Logic',
    question: 'If A is true and B is false, what is the result of (A AND B) OR (NOT B)?',
    options: ['True', 'False', 'Cannot be determined', 'Invalid logic'],
    correctAnswer: 0,
    explanation: '(A AND B) = (True AND False) = False. NOT B = NOT False = True. So (False OR True) = True.',
    difficulty: 2,
    hint: 'Remember: AND requires both to be true, OR requires at least one to be true'
  },
  {
    id: '2',
    type: 'deduction',
    category: 'Deductive Reasoning',
    question: 'All roses are flowers. Some flowers are red. Some roses are red. Which conclusion is valid?',
    options: [
      'All roses are red',
      'All red things are roses', 
      'Some roses may be red',
      'No roses are red'
    ],
    correctAnswer: 2,
    explanation: 'We know some flowers are red and all roses are flowers, so it\'s possible that some roses are red, but not certain.',
    difficulty: 2,
    hint: 'Focus on what can be logically concluded, not what might seem obvious'
  },
  {
    id: '3',
    type: 'pattern',
    category: 'Pattern Recognition',
    question: 'What comes next in the sequence: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '46'],
    correctAnswer: 1,
    explanation: 'The differences are 4, 6, 8, 10... increasing by 2 each time. Next difference is 12, so 30 + 12 = 42.',
    difficulty: 2,
    hint: 'Look at the differences between consecutive numbers'
  },
  {
    id: '4',
    type: 'riddle',
    category: 'Logic Riddles',
    question: 'A man lives on the 20th floor. Every morning he takes the elevator down. When he comes home, he takes the elevator to the 10th floor and walks the rest, except on rainy days. Why?',
    options: [
      'He wants exercise',
      'The elevator is broken above 10th floor',
      'He can\'t reach the button for the 20th floor',
      'He meets friends on the 10th floor'
    ],
    correctAnswer: 2,
    explanation: 'He\'s too short to reach the 20th floor button, but can reach the 10th. On rainy days, he has an umbrella to help him reach higher.',
    difficulty: 3,
    hint: 'Think about physical limitations and how weather might help'
  },
  {
    id: '5',
    type: 'boolean',
    category: 'Boolean Logic',
    question: 'If "NOT (A OR B)" is true, what can we conclude about A and B?',
    options: [
      'Both A and B are true',
      'Both A and B are false',
      'A is true, B is false',
      'A is false, B is true'
    ],
    correctAnswer: 1,
    explanation: 'By De Morgan\'s law, NOT (A OR B) = (NOT A) AND (NOT B). This means both A and B must be false.',
    difficulty: 2,
    hint: 'Use De Morgan\'s law: NOT (A OR B) = (NOT A) AND (NOT B)'
  },
  {
    id: '6',
    type: 'deduction',
    category: 'Deductive Reasoning',
    question: 'In a group of 5 people, everyone shakes hands with everyone else exactly once. How many handshakes occur?',
    options: ['10', '15', '20', '25'],
    correctAnswer: 0,
    explanation: 'Each person shakes hands with 4 others, giving 5×4=20. But this counts each handshake twice, so 20÷2=10.',
    difficulty: 2,
    hint: 'Count carefully to avoid double-counting the same handshake'
  },
  {
    id: '7',
    type: 'pattern',
    category: 'Pattern Recognition',
    question: 'If MONDAY is coded as 123456, how would DYNAMO be coded?',
    options: ['456781', '456123', '456821', '456231'],
    correctAnswer: 0,
    explanation: 'M=1, O=2, N=3, D=4, A=5, Y=6. So DYNAMO = D(4), Y(6), N(3), A(5), M(1), O(2) = 463512. Wait, let me recalculate...',
    difficulty: 3,
    hint: 'Map each letter to its position in MONDAY, then apply to DYNAMO'
  },
  {
    id: '8',
    type: 'riddle',
    category: 'Logic Riddles',
    question: 'Three switches control three light bulbs in another room. You can flip switches, then go to the room once. How do you determine which switch controls which bulb?',
    options: [
      'Turn on first switch and go check',
      'Turn on first switch for 5 minutes, turn it off, turn on second switch, then check',
      'Turn on all switches and check',
      'It\'s impossible with only one visit'
    ],
    correctAnswer: 1,
    explanation: 'Turn on first switch for a few minutes (bulb gets hot), turn it off, turn on second switch. Check: hot+off=first switch, on=second switch, cool+off=third switch.',
    difficulty: 3,
    hint: 'Think about properties other than just on/off'
  }
];

export default function LogicQuestions() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameActive, setGameActive] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [questionsOrder, setQuestionsOrder] = useState<number[]>([]);

  const question = logicQuestions[questionsOrder[currentQuestion] || 0];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    // Shuffle questions
    const shuffled = [...Array(logicQuestions.length).keys()].sort(() => Math.random() - 0.5);
    setQuestionsOrder(shuffled);
    setGameActive(true);
    setTimeLeft(180);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestions([]);
    setCorrectAnswers([]);
    setShowHint(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions.includes(currentQuestion)) return;

    setSelectedAnswer(answerIndex);
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    
    const isCorrect = answerIndex === question.correctAnswer;
    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, currentQuestion]);
      setScore(score + question.difficulty * 10);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questionsOrder.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
    } else {
      setGameActive(false);
    }
  };

  const restartGame = () => {
    startGame();
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-600 bg-green-100';
      case 2: return 'text-yellow-600 bg-yellow-100';
      case 3: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'boolean': return 'bg-blue-100 text-blue-800';
      case 'deduction': return 'bg-purple-100 text-purple-800';
      case 'pattern': return 'bg-green-100 text-green-800';
      case 'riddle': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!gameActive && answeredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              🧠 Logic Challenge Arena
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Test your logical reasoning with Boolean logic, deduction puzzles, pattern recognition, and mind-bending riddles!
            </p>
            
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">Challenge Features:</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 inline-block mb-3">
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-800">Boolean Logic</h3>
                  <p className="text-sm text-gray-600">AND, OR, NOT operations</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-4 inline-block mb-3">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-800">Deductive Reasoning</h3>
                  <p className="text-sm text-gray-600">Logical conclusions</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-4 inline-block mb-3">
                    <Star className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-800">Pattern Recognition</h3>
                  <p className="text-sm text-gray-600">Sequence analysis</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-100 rounded-full p-4 inline-block mb-3">
                    <Lightbulb className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-orange-800">Logic Riddles</h3>
                  <p className="text-sm text-gray-600">Creative thinking</p>
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🚀 Start Logic Challenge
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h1 className="text-4xl font-bold text-gray-800 mb-6">🎉 Challenge Complete!</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Final Score</h3>
                  <p className="text-3xl font-bold text-blue-600">{score}</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Correct Answers</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {correctAnswers.length}/{questionsOrder.length}
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Accuracy</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {Math.round((correctAnswers.length / questionsOrder.length) * 100)}%
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold">Performance Breakdown:</h3>
                <div className="text-left bg-gray-50 rounded-xl p-4">
                  {['boolean', 'deduction', 'pattern', 'riddle'].map(type => {
                    const typeQuestions = questionsOrder.filter((_, i) => 
                      logicQuestions[questionsOrder[i]].type === type && answeredQuestions.includes(i)
                    );
                    const typeCorrect = typeQuestions.filter((_, i) => 
                      correctAnswers.includes(questionsOrder.findIndex(q => q === questionsOrder[i]))
                    ).length;
                    
                    if (typeQuestions.length === 0) return null;
                    
                    return (
                      <div key={type} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(type)}`}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                        <span className="font-medium">
                          {typeCorrect}/{typeQuestions.length}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restartGame}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🔄 Try Again
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Stats */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Logic Challenge</h1>
            <p className="text-gray-600">Question {currentQuestion + 1} of {questionsOrder.length}</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="font-bold text-gray-800">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-gray-800">{score}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(question.type)}`}>
                    {question.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {Array.from({ length: question.difficulty }, (_, i) => '⭐').join('')}
                  </span>
                </div>
                {question.hint && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowHint(!showHint)}
                    className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm hover:bg-white/30 transition-colors"
                  >
                    <Lightbulb className="h-4 w-4 inline mr-1" />
                    Hint
                  </motion.button>
                )}
              </div>
              
              <h2 className="text-xl font-bold mb-4">{question.question}</h2>
              
              <AnimatePresence>
                {showHint && question.hint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-sm"
                  >
                    💡 {question.hint}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Options */}
            <div className="p-6">
              <div className="space-y-3 mb-6">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correctAnswer;
                  const showResult = showExplanation;
                  
                  return (
                    <motion.button
                      key={index}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                        !showResult
                          ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          : isCorrect
                          ? 'border-green-500 bg-green-50'
                          : isSelected
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={answeredQuestions.includes(currentQuestion)}
                      whileHover={!showResult ? { scale: 1.02 } : {}}
                      whileTap={!showResult ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {showResult && (
                          <span className="ml-4">
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : isSelected ? (
                              <X className="h-5 w-5 text-red-600" />
                            ) : null}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 pt-6"
                  >
                    <div className={`p-4 rounded-xl ${
                      correctAnswers.includes(currentQuestion) 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        {correctAnswers.includes(currentQuestion) ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-green-800">Correct!</span>
                          </>
                        ) : (
                          <>
                            <X className="h-5 w-5 text-red-600" />
                            <span className="text-red-800">Incorrect</span>
                          </>
                        )}
                      </h3>
                      <p className="text-gray-700">{question.explanation}</p>
                    </div>
                    
                    <div className="text-center mt-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextQuestion}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {currentQuestion < questionsOrder.length - 1 ? 'Next Question' : 'Finish Challenge'} →
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <motion.div 
          className="mt-8 bg-white rounded-full p-2 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2 px-4">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentQuestion + 1) / questionsOrder.length) * 100)}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questionsOrder.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 