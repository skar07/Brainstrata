'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, CheckCircle, X, Clock, Star, Lightbulb, Target, RotateCcw, Code, Zap, Play, Binary } from 'lucide-react';

interface TechChallenge {
  id: string;
  type: 'algorithm' | 'logic-gates' | 'binary' | 'debugging' | 'system-design';
  category: string;
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: 1 | 2 | 3;
  hint?: string;
  visualData?: {
    inputs: string[];
    outputs: string[];
    process: string;
  };
}

const techChallenges: TechChallenge[] = [
  // Algorithm Challenges
  {
    id: '1',
    type: 'algorithm',
    category: 'Sorting Algorithms',
    question: 'What would be the result after one pass of bubble sort on [5, 2, 8, 1, 9]?',
    options: ['[2, 5, 1, 8, 9]', '[2, 5, 8, 1, 9]', '[1, 2, 5, 8, 9]', '[5, 2, 1, 8, 9]'],
    correctAnswer: '[2, 5, 1, 8, 9]',
    explanation: 'Bubble sort compares adjacent elements and swaps them if they\'re in wrong order. After one pass: 5,2→2,5 then 5,8 (no swap), then 8,1→1,8, then 8,9 (no swap).',
    difficulty: 2,
    hint: 'Compare each adjacent pair and swap if the left is greater than the right'
  },
  {
    id: '2',
    type: 'logic-gates',
    category: 'Boolean Logic',
    question: 'What is the output of an AND gate when inputs are A=1, B=0?',
    visualData: {
      inputs: ['A=1', 'B=0'],
      outputs: ['?'],
      process: 'AND Gate'
    },
    options: ['0', '1', 'undefined', 'error'],
    correctAnswer: '0',
    explanation: 'An AND gate outputs 1 only when ALL inputs are 1. Since B=0, the output is 0.',
    difficulty: 1,
    hint: 'AND gates need ALL inputs to be 1 to output 1'
  },
  {
    id: '3',
    type: 'binary',
    category: 'Number Systems',
    question: 'Convert binary 1011 to decimal:',
    options: ['11', '13', '9', '15'],
    correctAnswer: '11',
    explanation: '1011₂ = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11₁₀',
    difficulty: 2,
    hint: 'Multiply each digit by the corresponding power of 2 and sum them'
  },
  {
    id: '4',
    type: 'debugging',
    category: 'Code Analysis',
    question: 'What\'s wrong with this code?',
    codeSnippet: `function factorial(n) {
  if (n == 0) return 1;
  return n * factorial(n);
}`,
    options: [
      'Missing semicolon',
      'Infinite recursion - should be n-1',
      'Wrong base case',
      'Function name is wrong'
    ],
    correctAnswer: 'Infinite recursion - should be n-1',
    explanation: 'The recursive call uses factorial(n) instead of factorial(n-1), causing infinite recursion.',
    difficulty: 2,
    hint: 'Look at what happens when the function calls itself'
  },
  {
    id: '5',
    type: 'system-design',
    category: 'Architecture',
    question: 'In a client-server model, where is business logic typically processed?',
    options: ['Client only', 'Server only', 'Both client and server', 'Database only'],
    correctAnswer: 'Both client and server',
    explanation: 'Modern applications often split business logic: client handles UI logic and validations, server handles core business rules and data integrity.',
    difficulty: 3,
    hint: 'Think about where different types of processing happen in web applications'
  },
  {
    id: '6',
    type: 'algorithm',
    category: 'Search Algorithms',
    question: 'In binary search, what happens if the target is smaller than the middle element?',
    options: [
      'Search the right half',
      'Search the left half', 
      'Start over from beginning',
      'The target doesn\'t exist'
    ],
    correctAnswer: 'Search the left half',
    explanation: 'Binary search eliminates half the possibilities each step. If target < middle, it must be in the left half.',
    difficulty: 2,
    hint: 'Binary search works on sorted arrays - think about where smaller values would be'
  },
  {
    id: '7',
    type: 'logic-gates',
    category: 'Digital Circuits',
    question: 'What gate would you use to create a "NOT A AND NOT B" function?',
    options: ['AND', 'OR', 'NOR', 'NAND'],
    correctAnswer: 'NOR',
    explanation: 'NOT A AND NOT B is equivalent to NOT(A OR B), which is exactly what a NOR gate does.',
    difficulty: 3,
    hint: 'Use De Morgan\'s law: NOT A AND NOT B = NOT(A OR B)'
  },
  {
    id: '8',
    type: 'binary',
    category: 'Bitwise Operations',
    question: 'What is 1010 XOR 1100 in binary?',
    options: ['0110', '1110', '0010', '1000'],
    correctAnswer: '0110',
    explanation: 'XOR compares bits: 1⊕1=0, 0⊕1=1, 1⊕0=1, 0⊕0=0. So 1010 ⊕ 1100 = 0110.',
    difficulty: 2,
    hint: 'XOR outputs 1 when bits are different, 0 when they\'re the same'
  },
  {
    id: '9',
    type: 'debugging',
    category: 'Logic Errors',
    question: 'Why might this loop not work as expected?',
    codeSnippet: `for (let i = 0; i < 5; i--) {
  console.log(i);
}`,
    options: [
      'i should start at 1',
      'Should use i++ instead of i--',
      'Missing semicolon',
      'console.log is misspelled'
    ],
    correctAnswer: 'Should use i++ instead of i--',
    explanation: 'The loop decrements i (i--) but checks i < 5. Since i starts at 0 and decreases, it will never reach 5, causing an infinite loop.',
    difficulty: 1,
    hint: 'Look at the direction i is changing versus the loop condition'
  },
  {
    id: '10',
    type: 'system-design',
    category: 'Performance',
    question: 'What\'s the main advantage of using a hash table for lookups?',
    options: [
      'Uses less memory',
      'Always sorted',
      'O(1) average lookup time',
      'Stores data permanently'
    ],
    correctAnswer: 'O(1) average lookup time',
    explanation: 'Hash tables provide constant O(1) average time complexity for lookups, much faster than linear O(n) search.',
    difficulty: 2,
    hint: 'Think about how quickly you can find data in different data structures'
  }
];

export default function TechLogic() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(540); // 9 minutes
  const [gameActive, setGameActive] = useState(false);
  const [answeredChallenges, setAnsweredChallenges] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [challengesOrder, setChallengesOrder] = useState<number[]>([]);

  const challenge = techChallenges[challengesOrder[currentChallenge] || 0];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    const shuffled = [...Array(techChallenges.length).keys()].sort(() => Math.random() - 0.5);
    setChallengesOrder(shuffled);
    setGameActive(true);
    setTimeLeft(540);
    setScore(0);
    setCurrentChallenge(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredChallenges([]);
    setCorrectAnswers([]);
    setShowHint(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (answeredChallenges.includes(currentChallenge)) return;

    setSelectedAnswer(answer);
    setAnsweredChallenges([...answeredChallenges, currentChallenge]);
    
    const isCorrect = answer === challenge.correctAnswer;
    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, currentChallenge]);
      setScore(score + challenge.difficulty * 30);
    }
    
    setShowExplanation(true);
  };

  const nextChallenge = () => {
    if (currentChallenge < challengesOrder.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
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
      case 'algorithm': return 'bg-blue-500';
      case 'logic-gates': return 'bg-purple-500';
      case 'binary': return 'bg-green-500';
      case 'debugging': return 'bg-red-500';
      case 'system-design': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderCodeSnippet = () => {
    if (!challenge.codeSnippet) return null;

    return (
      <div className="bg-gray-900 rounded-xl p-6 mb-6 overflow-x-auto">
        <div className="flex items-center gap-2 mb-4">
          <Code className="h-5 w-5 text-green-400" />
          <span className="text-green-400 font-semibold">Code Analysis</span>
        </div>
        <pre className="text-green-300 font-mono text-sm leading-relaxed">
          <code>{challenge.codeSnippet}</code>
        </pre>
      </div>
    );
  };

  const renderVisualData = () => {
    if (!challenge.visualData) return null;

    const { inputs, outputs, process } = challenge.visualData;

    return (
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Binary className="h-5 w-5" />
          Logic Circuit
        </h4>
        
        <div className="flex items-center justify-center gap-8">
          {/* Inputs */}
          <div className="space-y-2">
            {inputs.map((input, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-mono text-sm"
              >
                {input}
              </motion.div>
            ))}
          </div>

          {/* Process */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-purple-100 text-purple-700 px-6 py-4 rounded-xl font-semibold"
          >
            {process}
          </motion.div>

          {/* Outputs */}
          <div className="space-y-2">
            {outputs.map((output, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                className="bg-green-100 text-green-700 px-3 py-2 rounded-lg font-mono text-sm"
              >
                {output}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
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
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Cpu className="h-10 w-10 text-white" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Tech Logic
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Challenge your programming logic with algorithms, debugging, and system design puzzles!
              </p>

              {answeredChallenges.length > 0 && (
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Debugging Complete</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">{score}</div>
                      <div className="text-gray-600">Final Score</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">{correctAnswers.length}</div>
                      <div className="text-gray-600">Solved</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">
                        {((correctAnswers.length / answeredChallenges.length) * 100).toFixed(0)}%
                      </div>
                      <div className="text-gray-600">Success Rate</div>
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
              {answeredChallenges.length > 0 ? 'Debug Again' : 'Start Coding'}
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
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Tech Logic</h1>
                <p className="text-gray-600">Challenge {currentChallenge + 1} of {challengesOrder.length}</p>
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
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Zap className="h-4 w-4" />
              <span className="capitalize">{challenge.type.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Visual Data (for logic gates) */}
          {renderVisualData()}

          {/* Code Snippet (for debugging) */}
          {renderCodeSnippet()}

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{challenge.question}</h2>

          {/* Multiple Choice Options */}
          {challenge.options && (
            <div className="grid grid-cols-1 gap-4 mb-6">
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
                    <span className="font-medium font-mono">{option}</span>
                  </div>
                </motion.button>
              ))}
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
              Show Dev Hint
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
                    <h4 className="font-semibold text-yellow-800 mb-1">Developer Hint:</h4>
                    <p className="text-yellow-700 font-mono text-sm">{challenge.hint}</p>
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
                      {correctAnswers.includes(currentChallenge) ? 'Code Compiled Successfully!' : 'Logic Error Found'}
                    </h4>
                    <p className={`mb-4 ${
                      correctAnswers.includes(currentChallenge) ? 'text-green-700' : 'text-red-700'
                    }`}>
                      The correct answer is: <strong className="font-mono">{challenge.correctAnswer}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Technical Explanation:
                  </h5>
                  <p className="text-gray-700">{challenge.explanation}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextChallenge}
                  className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
                >
                  {currentChallenge < challengesOrder.length - 1 ? 'Next Challenge' : 'Deploy Code'}
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
              Reset IDE
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
} 