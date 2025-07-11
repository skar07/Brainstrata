'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, Star, Brain, Target, RotateCcw, BookOpen } from 'lucide-react';

interface TrueFalseQuestion {
  id: string;
  category: string;
  subject: string;
  question: string;
  answer: boolean;
  explanation: string;
  difficulty: 1 | 2 | 3;
  funFact?: string;
}

const trueFalseQuestions: TrueFalseQuestion[] = [
  // Science
  {
    id: '1',
    category: 'Science',
    subject: 'Physics',
    question: 'Lightning never strikes the same place twice.',
    answer: false,
    explanation: 'Lightning can and often does strike the same place multiple times. Tall structures like the Empire State Building get struck many times per year.',
    difficulty: 2,
    funFact: 'The Empire State Building gets struck by lightning about 10 times per year!'
  },
  {
    id: '2',
    category: 'Science',
    subject: 'Biology',
    question: 'Humans only use 10% of their brain.',
    answer: false,
    explanation: 'This is a myth. Modern brain imaging shows that humans use virtually all of their brain, even during simple tasks.',
    difficulty: 1,
    funFact: 'Brain scans show activity throughout the brain even during sleep!'
  },
  {
    id: '3',
    category: 'Science',
    subject: 'Chemistry',
    question: 'Diamonds are the hardest natural substance on Earth.',
    answer: true,
    explanation: 'Diamonds rate 10 on the Mohs hardness scale, making them the hardest naturally occurring substance.',
    difficulty: 2,
    funFact: 'Diamond\'s hardness comes from its crystal structure where each carbon atom bonds to four others!'
  },
  
  // Math
  {
    id: '4',
    category: 'Math',
    subject: 'Geometry',
    question: 'The sum of angles in any triangle is always 180 degrees.',
    answer: true,
    explanation: 'This is true for triangles in Euclidean (flat) geometry. However, in non-Euclidean geometry, this can be different.',
    difficulty: 1,
    funFact: 'On a sphere, triangle angles can sum to more than 180 degrees!'
  },
  {
    id: '5',
    category: 'Math',
    subject: 'Algebra',
    question: 'Zero is neither positive nor negative.',
    answer: true,
    explanation: 'Zero is considered neither positive nor negative. It\'s the neutral element that separates positive and negative numbers.',
    difficulty: 1,
    funFact: 'Zero was invented as a concept around 628 CE by the Indian mathematician Brahmagupta!'
  },
  {
    id: '6',
    category: 'Math',
    subject: 'Statistics',
    question: 'Correlation always implies causation.',
    answer: false,
    explanation: 'Correlation does not imply causation. Two variables can be correlated without one causing the other.',
    difficulty: 2,
    funFact: 'Ice cream sales and drowning deaths are correlated, but ice cream doesn\'t cause drowning - hot weather causes both!'
  },

  // Technology
  {
    id: '7',
    category: 'Technology',
    subject: 'Computer Science',
    question: 'Binary code only uses the digits 0 and 1.',
    answer: true,
    explanation: 'Binary is a base-2 number system that only uses two digits: 0 and 1.',
    difficulty: 1,
    funFact: 'The word "bit" comes from "binary digit"!'
  },
  {
    id: '8',
    category: 'Technology',
    subject: 'Internet',
    question: 'The World Wide Web and the Internet are the same thing.',
    answer: false,
    explanation: 'The Internet is the global network infrastructure, while the Web is just one service that runs on the Internet.',
    difficulty: 2,
    funFact: 'The Web was invented by Tim Berners-Lee in 1989 at CERN!'
  },

  // English/Language
  {
    id: '9',
    category: 'Language',
    subject: 'English Grammar',
    question: 'A double negative always makes a positive.',
    answer: false,
    explanation: 'In standard English, double negatives are often considered incorrect, but in some dialects and languages, they provide emphasis rather than canceling out.',
    difficulty: 2,
    funFact: 'Shakespeare frequently used double negatives for emphasis!'
  },
  {
    id: '10',
    category: 'Language',
    subject: 'Vocabulary',
    question: 'The word "set" has the most different meanings in English.',
    answer: true,
    explanation: 'The word "set" has over 400 different meanings according to the Oxford English Dictionary.',
    difficulty: 3,
    funFact: 'The word "run" comes in second with about 300 different meanings!'
  },

  // History/Social Studies
  {
    id: '11',
    category: 'History',
    subject: 'Ancient History',
    question: 'The Great Wall of China is visible from space with the naked eye.',
    answer: false,
    explanation: 'This is a common myth. The Great Wall is not visible from space with the naked eye, according to astronauts.',
    difficulty: 2,
    funFact: 'Many man-made structures are actually more visible from space than the Great Wall!'
  },
  {
    id: '12',
    category: 'History',
    subject: 'Geography',
    question: 'Australia is both a country and a continent.',
    answer: true,
    explanation: 'Australia is unique in being both a country and a continent.',
    difficulty: 1,
    funFact: 'Australia is the smallest continent but the 6th largest country!'
  }
];

export default function TrueFalseQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(200);
  const [gameActive, setGameActive] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [questionsOrder, setQuestionsOrder] = useState<number[]>([]);
  const [filterSubject, setFilterSubject] = useState<string>('All');

  const question = trueFalseQuestions[questionsOrder[currentQuestion] || 0];

  const subjects = ['All', ...new Set(trueFalseQuestions.map(q => q.category))];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  const startGame = (subject: string = filterSubject) => {
    let filteredQuestions = trueFalseQuestions;
    if (subject !== 'All') {
      filteredQuestions = trueFalseQuestions.filter(q => q.category === subject);
    }
    
    const shuffled = filteredQuestions
      .map((_, index) => trueFalseQuestions.findIndex(q => q.id === filteredQuestions[index].id))
      .sort(() => Math.random() - 0.5);
    
    setQuestionsOrder(shuffled);
    setGameActive(true);
    setTimeLeft(shuffled.length * 15 + 50); // 15 seconds per question + buffer
    setScore(0);
    setStreak(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestions([]);
    setCorrectAnswers([]);
  };

  const handleAnswerSelect = (answer: boolean) => {
    if (answeredQuestions.includes(currentQuestion)) return;

    setSelectedAnswer(answer);
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    
    const isCorrect = answer === question.answer;
    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, currentQuestion]);
      const points = question.difficulty * 10 + (streak >= 3 ? 5 : 0); // Bonus for streaks
      setScore(score + points);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
    } else {
      setStreak(0);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questionsOrder.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameActive(false);
    }
  };

  const restartGame = () => {
    startGame();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Science': return 'bg-green-100 text-green-800';
      case 'Math': return 'bg-blue-100 text-blue-800';
      case 'Technology': return 'bg-purple-100 text-purple-800';
      case 'Language': return 'bg-orange-100 text-orange-800';
      case 'History': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: difficulty }, (_, i) => (
      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
    ));
  };

  if (!gameActive && answeredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              ✅ True or False Challenge
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Test your knowledge across multiple subjects with critical thinking questions!
            </p>
            
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-xl max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">Choose Your Challenge:</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {subjects.map((subject) => {
                  const count = subject === 'All' 
                    ? trueFalseQuestions.length 
                    : trueFalseQuestions.filter(q => q.category === subject).length;
                  
                  return (
                    <motion.button
                      key={subject}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilterSubject(subject)}
                      className={`p-4 rounded-xl transition-all duration-300 ${
                        filterSubject === subject
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="font-semibold">{subject}</div>
                      <div className="text-sm opacity-80">{count} questions</div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-4 inline-block mb-3">
                    <Brain className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-800">Critical Thinking</h3>
                  <p className="text-sm text-gray-600">Analyze statements carefully</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 inline-block mb-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-800">Multi-Subject</h3>
                  <p className="text-sm text-gray-600">Science, Math, Tech & More</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-4 inline-block mb-3">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-800">Streak Bonus</h3>
                  <p className="text-sm text-gray-600">Extra points for streaks</p>
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame()}
              className="px-12 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🚀 Start Quiz
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h1 className="text-4xl font-bold text-gray-800 mb-6">🎉 Quiz Complete!</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Final Score</h3>
                  <p className="text-2xl font-bold text-blue-600">{score}</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Correct</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {correctAnswers.length}/{questionsOrder.length}
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Accuracy</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round((correctAnswers.length / questionsOrder.length) * 100)}%
                  </p>
                </div>
                
                <div className="bg-orange-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">Best Streak</h3>
                  <p className="text-2xl font-bold text-orange-600">{bestStreak}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restartGame}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Stats */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">True or False Quiz</h1>
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
            
            <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                <span className="font-bold text-gray-800">Streak: {streak}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.4 }}
          >
            {/* Question Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(question.category)}`}>
                    {question.category} - {question.subject}
                  </span>
                  <div className="flex gap-1">
                    {getDifficultyStars(question.difficulty)}
                  </div>
                </div>
                
                {streak >= 3 && (
                  <motion.div
                    className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🔥 Streak Bonus!
                  </motion.div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold">{question.question}</h2>
            </div>

            {/* True/False Buttons */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <motion.button
                  className={`p-8 rounded-2xl border-4 transition-all duration-300 ${
                    selectedAnswer === true
                      ? question.answer === true
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                  onClick={() => handleAnswerSelect(true)}
                  disabled={answeredQuestions.includes(currentQuestion)}
                  whileHover={!showExplanation ? { scale: 1.02 } : {}}
                  whileTap={!showExplanation ? { scale: 0.98 } : {}}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <div className="text-2xl font-bold text-green-700">TRUE</div>
                  </div>
                </motion.button>

                <motion.button
                  className={`p-8 rounded-2xl border-4 transition-all duration-300 ${
                    selectedAnswer === false
                      ? question.answer === false
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                  }`}
                  onClick={() => handleAnswerSelect(false)}
                  disabled={answeredQuestions.includes(currentQuestion)}
                  whileHover={!showExplanation ? { scale: 1.02 } : {}}
                  whileTap={!showExplanation ? { scale: 0.98 } : {}}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <div className="text-2xl font-bold text-red-700">FALSE</div>
                  </div>
                </motion.button>
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
                    <div className={`p-6 rounded-xl ${
                      correctAnswers.includes(currentQuestion) 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                        {correctAnswers.includes(currentQuestion) ? (
                          <>
                            <Check className="h-6 w-6 text-green-600" />
                            <span className="text-green-800">Correct! 🎉</span>
                          </>
                        ) : (
                          <>
                            <X className="h-6 w-6 text-red-600" />
                            <span className="text-red-800">Not quite! 🤔</span>
                          </>
                        )}
                      </h3>
                      
                      <p className="text-gray-700 text-lg mb-4">{question.explanation}</p>
                      
                      {question.funFact && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2">💡 Fun Fact:</h4>
                          <p className="text-blue-700">{question.funFact}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center mt-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextQuestion}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {currentQuestion < questionsOrder.length - 1 ? 'Next Question' : 'Finish Quiz'} →
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
              className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full"
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