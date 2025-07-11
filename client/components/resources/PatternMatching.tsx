'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, CheckCircle, X, RotateCcw, Trophy, Clock, Star } from 'lucide-react';

interface Pattern {
  id: string;
  shape: string;
  color: string;
  size: 'sm' | 'md' | 'lg';
  rotation: number;
}

interface Challenge {
  id: string;
  type: 'color' | 'shape' | 'sequence' | 'size';
  title: string;
  description: string;
  target: Pattern[];
  options: Pattern[];
  difficulty: number;
}

const shapes = ['circle', 'square', 'triangle', 'diamond', 'star', 'heart'];
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
const sizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg'];

const generateChallenges = (): Challenge[] => [
  {
    id: '1',
    type: 'color',
    title: 'Color Matching',
    description: 'Match shapes by their colors',
    difficulty: 1,
    target: [
      { id: 't1', shape: 'circle', color: 'red', size: 'md', rotation: 0 },
      { id: 't2', shape: 'square', color: 'blue', size: 'md', rotation: 0 },
      { id: 't3', shape: 'triangle', color: 'green', size: 'md', rotation: 0 }
    ],
    options: [
      { id: 'o1', shape: 'diamond', color: 'red', size: 'md', rotation: 0 },
      { id: 'o2', shape: 'star', color: 'yellow', size: 'md', rotation: 0 },
      { id: 'o3', shape: 'heart', color: 'blue', size: 'md', rotation: 0 },
      { id: 'o4', shape: 'circle', color: 'green', size: 'md', rotation: 0 },
      { id: 'o5', shape: 'square', color: 'purple', size: 'md', rotation: 0 },
      { id: 'o6', shape: 'triangle', color: 'red', size: 'md', rotation: 0 }
    ]
  },
  {
    id: '2',
    type: 'shape',
    title: 'Shape Matching',
    description: 'Match patterns by their shapes',
    difficulty: 2,
    target: [
      { id: 't1', shape: 'star', color: 'red', size: 'md', rotation: 0 },
      { id: 't2', shape: 'heart', color: 'blue', size: 'md', rotation: 0 },
      { id: 't3', shape: 'diamond', color: 'green', size: 'md', rotation: 0 }
    ],
    options: [
      { id: 'o1', shape: 'star', color: 'yellow', size: 'lg', rotation: 45 },
      { id: 'o2', shape: 'circle', color: 'red', size: 'md', rotation: 0 },
      { id: 'o3', shape: 'heart', color: 'purple', size: 'sm', rotation: 0 },
      { id: 'o4', shape: 'square', color: 'green', size: 'md', rotation: 0 },
      { id: 'o5', shape: 'diamond', color: 'orange', size: 'md', rotation: 0 },
      { id: 'o6', shape: 'triangle', color: 'blue', size: 'lg', rotation: 0 }
    ]
  },
  {
    id: '3',
    type: 'sequence',
    title: 'Sequence Pattern',
    description: 'Complete the pattern sequence',
    difficulty: 3,
    target: [
      { id: 't1', shape: 'circle', color: 'red', size: 'sm', rotation: 0 },
      { id: 't2', shape: 'square', color: 'blue', size: 'md', rotation: 0 },
      { id: 't3', shape: 'triangle', color: 'green', size: 'lg', rotation: 0 },
      { id: 't4', shape: 'circle', color: 'yellow', size: 'sm', rotation: 0 }
    ],
    options: [
      { id: 'o1', shape: 'square', color: 'purple', size: 'md', rotation: 0 },
      { id: 'o2', shape: 'circle', color: 'orange', size: 'sm', rotation: 0 },
      { id: 'o3', shape: 'triangle', color: 'pink', size: 'lg', rotation: 0 },
      { id: 'o4', shape: 'diamond', color: 'cyan', size: 'md', rotation: 0 },
      { id: 'o5', shape: 'star', color: 'red', size: 'lg', rotation: 0 },
      { id: 'o6', shape: 'heart', color: 'blue', size: 'sm', rotation: 0 }
    ]
  }
];

export default function PatternMatching() {
  const [challenges] = useState<Challenge[]>(generateChallenges());
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Pattern[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameActive, setGameActive] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const challenge = challenges[currentChallenge];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    setGameActive(true);
    setTimeLeft(120);
    setScore(0);
    setCurrentChallenge(0);
    setSelectedOptions([]);
    setCompletedChallenges([]);
    setShowResult(false);
    setMistakes(0);
  };

  const handleOptionSelect = (option: Pattern) => {
    if (!gameActive || selectedOptions.length >= challenge.target.length) return;

    const newSelected = [...selectedOptions, option];
    setSelectedOptions(newSelected);

    // Check if selection matches target pattern
    if (newSelected.length === challenge.target.length) {
      const isCorrect = checkPattern(newSelected, challenge);
      if (isCorrect) {
        setScore(score + (100 * challenge.difficulty));
        setCompletedChallenges([...completedChallenges, challenge.id]);
        setTimeout(() => {
          if (currentChallenge < challenges.length - 1) {
            setCurrentChallenge(currentChallenge + 1);
            setSelectedOptions([]);
          } else {
            setGameActive(false);
            setShowResult(true);
          }
        }, 1000);
      } else {
        setMistakes(mistakes + 1);
        setTimeout(() => setSelectedOptions([]), 1000);
      }
    }
  };

  const checkPattern = (selected: Pattern[], challenge: Challenge): boolean => {
    if (selected.length !== challenge.target.length) return false;

    switch (challenge.type) {
      case 'color':
        return selected.every((s, i) => s.color === challenge.target[i].color);
      case 'shape':
        return selected.every((s, i) => s.shape === challenge.target[i].shape);
      case 'sequence':
        // Check if it follows the pattern (alternating shape and increasing size)
        return selected.every((s, i) => 
          s.shape === challenge.target[i % challenge.target.length].shape &&
          s.size === challenge.target[i % challenge.target.length].size
        );
      case 'size':
        return selected.every((s, i) => s.size === challenge.target[i].size);
      default:
        return false;
    }
  };

  const resetChallenge = () => {
    setSelectedOptions([]);
  };

  const getShapeElement = (pattern: Pattern, isSelected = false) => {
    const sizeMap = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
    const colorMap = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      cyan: 'bg-cyan-500'
    };

    const baseClasses = `${sizeMap[pattern.size]} ${colorMap[pattern.color as keyof typeof colorMap]} transition-all duration-300`;
    const selectedClasses = isSelected ? 'ring-4 ring-green-400 scale-110' : '';

    switch (pattern.shape) {
      case 'circle':
        return (
          <motion.div 
            className={`${baseClasses} rounded-full ${selectedClasses}`}
            style={{ transform: `rotate(${pattern.rotation}deg)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        );
      case 'square':
        return (
          <motion.div 
            className={`${baseClasses} ${selectedClasses}`}
            style={{ transform: `rotate(${pattern.rotation}deg)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        );
      case 'triangle':
        return (
          <motion.div 
            className={`${sizeMap[pattern.size]} ${selectedClasses}`}
            style={{ transform: `rotate(${pattern.rotation}deg)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div 
              className={`w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent ${colorMap[pattern.color as keyof typeof colorMap].replace('bg-', 'border-b-')}`}
            />
          </motion.div>
        );
      case 'diamond':
        return (
          <motion.div 
            className={`${baseClasses} transform rotate-45 ${selectedClasses}`}
            style={{ transform: `rotate(${45 + pattern.rotation}deg)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        );
      case 'star':
        return (
          <motion.div 
            className={`${sizeMap[pattern.size]} ${selectedClasses} flex items-center justify-center`}
            style={{ transform: `rotate(${pattern.rotation}deg)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`text-2xl ${colorMap[pattern.color as keyof typeof colorMap].replace('bg-', 'text-')}`}>⭐</div>
          </motion.div>
        );
      case 'heart':
        return (
          <motion.div 
            className={`${sizeMap[pattern.size]} ${selectedClasses} flex items-center justify-center`}
            style={{ transform: `rotate(${pattern.rotation}deg)` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`text-2xl ${colorMap[pattern.color as keyof typeof colorMap].replace('bg-', 'text-')}`}>❤️</div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧩 Pattern Matching Challenge
          </h1>
          <p className="text-lg text-gray-600">
            Identify and match the patterns by color, shape, sequence, or size!
          </p>
        </motion.div>

        {/* Game Stats */}
        <motion.div 
          className="flex justify-center items-center gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-gray-800">Score: {score}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-gray-800">Time: {timeLeft}s</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-500" />
              <span className="font-bold text-gray-800">
                Level: {currentChallenge + 1}/{challenges.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              <span className="font-bold text-gray-800">Mistakes: {mistakes}</span>
            </div>
          </div>
        </motion.div>

        {gameActive && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Challenge Info */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{challenge.title}</h2>
                <p className="text-gray-600">{challenge.description}</p>
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: challenge.difficulty }, (_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>

              {/* Target Pattern */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-center mb-4">Target Pattern:</h3>
                <div className="flex justify-center items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  {challenge.target.map((pattern, index) => (
                    <motion.div
                      key={pattern.id}
                      className="flex items-center justify-center p-2"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    >
                      {getShapeElement(pattern)}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Selected Pattern */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-center mb-4">Your Selection:</h3>
                <div className="flex justify-center items-center gap-4 p-4 bg-blue-50 rounded-xl min-h-[80px]">
                  {selectedOptions.map((pattern, index) => (
                    <motion.div
                      key={`selected-${index}`}
                      className="flex items-center justify-center p-2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {getShapeElement(pattern, true)}
                    </motion.div>
                  ))}
                  {selectedOptions.length < challenge.target.length && (
                    <motion.div
                      className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="text-gray-400">?</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Options */}
              <div>
                <h3 className="text-lg font-semibold text-center mb-4">Choose from Options:</h3>
                <div className="grid grid-cols-6 gap-4 justify-items-center">
                  {challenge.options.map((option) => (
                    <motion.button
                      key={option.id}
                      className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                      onClick={() => handleOptionSelect(option)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={selectedOptions.length >= challenge.target.length}
                    >
                      {getShapeElement(option)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <div className="text-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetChallenge}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mx-auto"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Selection
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Start/Results Screen */}
        {!gameActive && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {showResult ? (
              <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto">
                <h3 className="text-3xl font-bold mb-4">🎉 Game Complete!</h3>
                <p className="text-lg text-gray-600 mb-4">
                  You completed {completedChallenges.length} out of {challenges.length} challenges
                </p>
                <p className="text-2xl font-bold text-blue-600 mb-6">
                  Final Score: {score}
                </p>
                <p className="text-gray-600 mb-6">
                  Mistakes: {mistakes}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  🔄 Play Again
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🚀 Start Pattern Challenge
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
} 