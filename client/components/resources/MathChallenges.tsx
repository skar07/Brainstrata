'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, CheckCircle, X, Clock, Star, Lightbulb, Target, RotateCcw, Equal, Plus, Minus, Divide, Play } from 'lucide-react';

interface MathChallenge {
  id: string;
  type: 'equation' | 'word-problem' | 'geometry' | 'logic-math';
  category: string;
  question: string;
  equation?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string[];
  difficulty: 1 | 2 | 3;
  hint?: string;
  components?: string[];
}

const mathChallenges: MathChallenge[] = [
  // Algebra Equations
  {
    id: '1',
    type: 'equation',
    category: 'Linear Equations',
    question: 'Solve for x: 3x + 7 = 22',
    equation: '3x + 7 = 22',
    correctAnswer: 5,
    explanation: [
      'Start with: 3x + 7 = 22',
      'Subtract 7 from both sides: 3x = 15',
      'Divide both sides by 3: x = 5'
    ],
    difficulty: 1,
    hint: 'First isolate the term with x, then solve',
    components: ['3x', '+7', '=', '22']
  },
  {
    id: '2',
    type: 'word-problem',
    category: 'Word Problems',
    question: 'Sarah has 3 times as many apples as Tom. Together they have 24 apples. How many apples does Sarah have?',
    options: ['6', '12', '18', '21'],
    correctAnswer: '18',
    explanation: [
      'Let Tom have x apples',
      'Sarah has 3x apples',
      'Together: x + 3x = 24',
      '4x = 24',
      'x = 6 (Tom\'s apples)',
      'Sarah has 3 × 6 = 18 apples'
    ],
    difficulty: 2,
    hint: 'Use variables to represent the unknowns'
  },
  {
    id: '3',
    type: 'geometry',
    category: 'Geometry',
    question: 'A circle has a radius of 8 cm. What is its area? (Use π ≈ 3.14)',
    options: ['50.24 cm²', '200.96 cm²', '25.12 cm²', '100.48 cm²'],
    correctAnswer: '200.96 cm²',
    explanation: [
      'Area of circle = πr²',
      'Given: r = 8 cm, π ≈ 3.14',
      'Area = 3.14 × 8²',
      'Area = 3.14 × 64',
      'Area = 200.96 cm²'
    ],
    difficulty: 2,
    hint: 'Remember: Area = π × radius²'
  },
  {
    id: '4',
    type: 'logic-math',
    category: 'Logic & Patterns',
    question: 'In the sequence 2, 6, 18, 54, ..., what is the next number?',
    options: ['108', '162', '216', '270'],
    correctAnswer: '162',
    explanation: [
      'Look at the pattern: 2, 6, 18, 54',
      '2 × 3 = 6',
      '6 × 3 = 18', 
      '18 × 3 = 54',
      'Each number is multiplied by 3',
      '54 × 3 = 162'
    ],
    difficulty: 2,
    hint: 'Look for the multiplication pattern'
  },
  {
    id: '5',
    type: 'equation',
    category: 'Quadratic Equations',
    question: 'Solve for x: x² - 5x + 6 = 0',
    equation: 'x² - 5x + 6 = 0',
    correctAnswer: '2, 3',
    explanation: [
      'Factor the quadratic: x² - 5x + 6 = 0',
      'Find two numbers that multiply to 6 and add to -5',
      'Those numbers are -2 and -3',
      'Factor: (x - 2)(x - 3) = 0',
      'Solutions: x = 2 or x = 3'
    ],
    difficulty: 3,
    hint: 'Try factoring or use the quadratic formula'
  },
  {
    id: '6',
    type: 'word-problem',
    category: 'Rate Problems',
    question: 'A car travels 240 miles in 4 hours. At this rate, how far will it travel in 7 hours?',
    options: ['420 miles', '480 miles', '360 miles', '560 miles'],
    correctAnswer: '420 miles',
    explanation: [
      'Find the rate: 240 miles ÷ 4 hours = 60 mph',
      'Distance = Rate × Time',
      'Distance = 60 mph × 7 hours',
      'Distance = 420 miles'
    ],
    difficulty: 1,
    hint: 'First find the speed (rate), then multiply by time'
  },
  {
    id: '7',
    type: 'geometry',
    category: 'Pythagorean Theorem',
    question: 'A right triangle has legs of 3 cm and 4 cm. What is the length of the hypotenuse?',
    options: ['5 cm', '6 cm', '7 cm', '8 cm'],
    correctAnswer: '5 cm',
    explanation: [
      'Use Pythagorean theorem: a² + b² = c²',
      'Given: a = 3 cm, b = 4 cm',
      '3² + 4² = c²',
      '9 + 16 = c²',
      '25 = c²',
      'c = 5 cm'
    ],
    difficulty: 2,
    hint: 'Use a² + b² = c² for right triangles'
  },
  {
    id: '8',
    type: 'logic-math',
    category: 'Number Theory',
    question: 'What is the greatest common divisor (GCD) of 48 and 18?',
    options: ['6', '8', '9', '12'],
    correctAnswer: '6',
    explanation: [
      'List factors of 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48',
      'List factors of 18: 1, 2, 3, 6, 9, 18',
      'Common factors: 1, 2, 3, 6',
      'Greatest common factor: 6'
    ],
    difficulty: 2,
    hint: 'Find all factors of both numbers, then find the largest common one'
  }
];

export default function MathChallenges() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameActive, setGameActive] = useState(false);
  const [answeredChallenges, setAnsweredChallenges] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [challengesOrder, setChallengesOrder] = useState<number[]>([]);
  const [draggedComponents, setDraggedComponents] = useState<string[]>([]);
  const [equationBuilder, setEquationBuilder] = useState<string[]>([]);

  const challenge = mathChallenges[challengesOrder[currentChallenge] || 0];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    const shuffled = [...Array(mathChallenges.length).keys()].sort(() => Math.random() - 0.5);
    setChallengesOrder(shuffled);
    setGameActive(true);
    setTimeLeft(300);
    setScore(0);
    setCurrentChallenge(0);
    setSelectedAnswer(null);
    setUserInput('');
    setShowExplanation(false);
    setAnsweredChallenges([]);
    setCorrectAnswers([]);
    setShowHint(false);
    setEquationBuilder([]);
  };

  const handleAnswerSelect = (answer: string) => {
    if (answeredChallenges.includes(currentChallenge)) return;

    setSelectedAnswer(answer);
    setAnsweredChallenges([...answeredChallenges, currentChallenge]);
    
    const isCorrect = answer.toString().toLowerCase() === challenge.correctAnswer.toString().toLowerCase();
    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, currentChallenge]);
      setScore(score + challenge.difficulty * 15);
    }
    
    setShowExplanation(true);
  };

  const handleInputSubmit = () => {
    if (answeredChallenges.includes(currentChallenge) || !userInput.trim()) return;

    setAnsweredChallenges([...answeredChallenges, currentChallenge]);
    
    const isCorrect = userInput.toLowerCase().trim() === challenge.correctAnswer.toString().toLowerCase();
    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, currentChallenge]);
      setScore(score + challenge.difficulty * 15);
    }
    
    setShowExplanation(true);
  };

  const nextChallenge = () => {
    if (currentChallenge < challengesOrder.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedAnswer(null);
      setUserInput('');
      setShowExplanation(false);
      setShowHint(false);
      setEquationBuilder([]);
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
      case 'equation': return 'bg-blue-500';
      case 'word-problem': return 'bg-purple-500';
      case 'geometry': return 'bg-green-500';
      case 'logic-math': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6"
                whileHover={{ scale: 1.05 }}
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Calculator className="h-10 w-10 text-white" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Math Challenges
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Solve equations, word problems, and mathematical puzzles with step-by-step explanations!
              </p>

              {answeredChallenges.length > 0 && (
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Game Results</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">{score}</div>
                      <div className="text-gray-600">Final Score</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">{correctAnswers.length}</div>
                      <div className="text-gray-600">Correct</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">
                        {((correctAnswers.length / answeredChallenges.length) * 100).toFixed(0)}%
                      </div>
                      <div className="text-gray-600">Accuracy</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="h-6 w-6" />
              {answeredChallenges.length > 0 ? 'Play Again' : 'Start Challenge'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Math Challenges</h1>
                <p className="text-gray-600">Question {currentChallenge + 1} of {challengesOrder.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-blue-600">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-800">{score}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentChallenge + 1) / challengesOrder.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Challenge Content */}
        <motion.div
          key={currentChallenge}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Challenge Header */}
          <div className="flex items-center gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
              Level {challenge.difficulty}
            </span>
            <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getCategoryColor(challenge.type)}`}>
              {challenge.category}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{challenge.question}</h2>

          {/* Equation Display for equation type */}
          {challenge.type === 'equation' && challenge.equation && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-gray-800 mb-4">
                  {challenge.equation}
                </div>
              </div>
            </div>
          )}

          {/* Answer Input/Selection */}
          {challenge.options ? (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {challenge.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={answeredChallenges.includes(currentChallenge)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedAnswer === option
                      ? correctAnswers.includes(currentChallenge)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter your answer..."
                  disabled={answeredChallenges.includes(currentChallenge)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleInputSubmit}
                  disabled={answeredChallenges.includes(currentChallenge) || !userInput.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          )}

          {/* Hint Button */}
          {challenge.hint && !showHint && !showExplanation && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHint(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg mb-6 hover:bg-yellow-200 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              Show Hint
            </motion.button>
          )}

          {/* Hint Display */}
          <AnimatePresence>
            {showHint && challenge.hint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Hint:</h4>
                    <p className="text-yellow-700">{challenge.hint}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`border rounded-xl p-6 mb-6 ${
                  correctAnswers.includes(currentChallenge)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  {correctAnswers.includes(currentChallenge) ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  ) : (
                    <X className="h-6 w-6 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-bold text-lg mb-2 ${
                      correctAnswers.includes(currentChallenge) ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {correctAnswers.includes(currentChallenge) ? 'Correct!' : 'Incorrect'}
                    </h4>
                    <p className={`mb-4 ${
                      correctAnswers.includes(currentChallenge) ? 'text-green-700' : 'text-red-700'
                    }`}>
                      The correct answer is: <strong>{challenge.correctAnswer}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-3">Step-by-step solution:</h5>
                  <div className="space-y-2">
                    {challenge.explanation.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg"
                      >
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 font-mono">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextChallenge}
                  className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
                >
                  {currentChallenge < challengesOrder.length - 1 ? 'Next Challenge' : 'Finish Game'}
                  {currentChallenge < challengesOrder.length - 1 && <Target className="h-5 w-5" />}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        {gameActive && (
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartGame}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              Restart
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
} 