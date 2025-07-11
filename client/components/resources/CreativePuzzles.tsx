'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, CheckCircle, X, Clock, Star, Lightbulb, Target, RotateCcw, Sparkles, Shuffle, Play, Brush } from 'lucide-react';

interface CreativePuzzle {
  id: string;
  type: 'visual-pattern' | 'color-logic' | 'shape-creation' | 'sequence-art' | 'innovation';
  category: string;
  question: string;
  visualElements?: {
    colors: string[];
    shapes: string[];
    pattern: string[];
  };
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 1 | 2 | 3;
  hint?: string;
  interactive?: boolean;
}

const creativePuzzles: CreativePuzzle[] = [
  // Visual Pattern Challenges
  {
    id: '1',
    type: 'visual-pattern',
    category: 'Pattern Recognition',
    question: 'What comes next in this color pattern?',
    visualElements: {
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FCEA2B'],
      shapes: ['circle', 'circle', 'circle', 'circle', 'circle'],
      pattern: ['red', 'teal', 'blue', 'green', '?']
    },
    options: ['Red', 'Yellow', 'Purple', 'Orange'],
    correctAnswer: 'Yellow',
    explanation: 'The pattern cycles through warm-cool-cool-warm colors, and yellow completes the warm color in the sequence.',
    difficulty: 2,
    hint: 'Look at the warm vs cool color pattern'
  },
  {
    id: '2',
    type: 'shape-creation',
    category: 'Spatial Reasoning',
    question: 'Which combination of shapes can create a perfect hexagon?',
    options: [
      '6 triangles',
      '3 squares', 
      '2 rectangles',
      '4 circles'
    ],
    correctAnswer: '6 triangles',
    explanation: 'Six equilateral triangles can be arranged around a center point to form a perfect regular hexagon.',
    difficulty: 2,
    hint: 'Think about how shapes can fit together without gaps'
  },
  {
    id: '3',
    type: 'color-logic',
    category: 'Color Theory',
    question: 'If you mix the primary colors Red + Blue, what secondary color do you get?',
    visualElements: {
      colors: ['#FF0000', '#0000FF', '#800080'],
      shapes: ['circle', 'circle', 'circle'],
      pattern: ['red', 'blue', 'result']
    },
    options: ['Green', 'Purple', 'Orange', 'Yellow'],
    correctAnswer: 'Purple',
    explanation: 'Red and blue are primary colors that combine to create the secondary color purple.',
    difficulty: 1,
    hint: 'Remember the basic color wheel and primary color mixing'
  },
  {
    id: '4',
    type: 'sequence-art',
    category: 'Creative Sequences',
    question: 'Complete this artistic sequence: 🎨 → 🖌️ → 🖼️ → ?',
    options: ['🎭', '🏛️', '👀', '💡'],
    correctAnswer: '👀',
    explanation: 'The sequence shows the artistic process: palette → brush → painting → viewing/appreciation.',
    difficulty: 2,
    hint: 'Think about the complete creative process from start to finish'
  },
  {
    id: '5',
    type: 'innovation',
    category: 'Creative Problem Solving',
    question: 'You need to carry water but only have a newspaper. What\'s the most creative solution?',
    options: [
      'Fold it into a cup',
      'Use it as a funnel',
      'Freeze the water first',
      'Soak the newspaper and wring it out'
    ],
    correctAnswer: 'Freeze the water first',
    explanation: 'Freezing water into ice allows you to wrap it in newspaper and carry it as a solid, then let it melt when needed.',
    difficulty: 3,
    hint: 'Think outside the box - change the state of the water!'
  },
  {
    id: '6',
    type: 'visual-pattern',
    category: 'Symmetry',
    question: 'Which type of symmetry does a butterfly have?',
    options: ['Rotational', 'Bilateral', 'Radial', 'No symmetry'],
    correctAnswer: 'Bilateral',
    explanation: 'Butterflies have bilateral symmetry - their left and right sides are mirror images of each other.',
    difficulty: 1,
    hint: 'Think about how the left and right wings of a butterfly relate to each other'
  },
  {
    id: '7',
    type: 'shape-creation',
    category: 'Geometric Art',
    question: 'How many different ways can you arrange 4 squares to create connected shapes?',
    options: ['3', '5', '7', '9'],
    correctAnswer: '5',
    explanation: 'There are 5 unique tetrominoes (4-square shapes): I, O, T, S, and L shapes.',
    difficulty: 3,
    hint: 'Think about Tetris pieces - these are called tetrominoes'
  },
  {
    id: '8',
    type: 'color-logic',
    category: 'Color Psychology',
    question: 'Which color is most commonly associated with creativity and imagination?',
    options: ['Red', 'Purple', 'Green', 'Blue'],
    correctAnswer: 'Purple',
    explanation: 'Purple combines the energy of red with the calm of blue, making it strongly associated with creativity, imagination, and artistic expression.',
    difficulty: 2,
    hint: 'This color has historically been linked to royalty, magic, and artistic expression'
  },
  {
    id: '9',
    type: 'innovation',
    category: 'Design Thinking',
    question: 'What\'s the first step in the design thinking process?',
    options: ['Prototype', 'Empathize', 'Test', 'Define'],
    correctAnswer: 'Empathize',
    explanation: 'Design thinking starts with empathizing - understanding the user\'s needs, thoughts, emotions, and motivations.',
    difficulty: 2,
    hint: 'Good design starts with understanding people'
  },
  {
    id: '10',
    type: 'sequence-art',
    category: 'Creative Logic',
    question: 'In the sequence: Sketch → Draft → Refine → ?, what comes next?',
    options: ['Start over', 'Present', 'Brainstorm', 'Research'],
    correctAnswer: 'Present',
    explanation: 'This sequence follows the creative workflow: initial sketch → detailed draft → refinement → final presentation.',
    difficulty: 2,
    hint: 'Think about what you do with a finished creative work'
  }
];

export default function CreativePuzzles() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(360); // 6 minutes
  const [gameActive, setGameActive] = useState(false);
  const [answeredPuzzles, setAnsweredPuzzles] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [puzzlesOrder, setPuzzlesOrder] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const puzzle = creativePuzzles[puzzlesOrder[currentPuzzle] || 0];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    const shuffled = [...Array(creativePuzzles.length).keys()].sort(() => Math.random() - 0.5);
    setPuzzlesOrder(shuffled);
    setGameActive(true);
    setTimeLeft(360);
    setScore(0);
    setCurrentPuzzle(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredPuzzles([]);
    setCorrectAnswers([]);
    setShowHint(false);
    setSelectedColors([]);
  };

  const handleAnswerSelect = (answer: string) => {
    if (answeredPuzzles.includes(currentPuzzle)) return;

    setSelectedAnswer(answer);
    setAnsweredPuzzles([...answeredPuzzles, currentPuzzle]);
    
    const isCorrect = answer === puzzle.correctAnswer;
    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, currentPuzzle]);
      setScore(score + puzzle.difficulty * 25);
    }
    
    setShowExplanation(true);
  };

  const nextPuzzle = () => {
    if (currentPuzzle < puzzlesOrder.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
      setSelectedColors([]);
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
      case 'visual-pattern': return 'bg-pink-500';
      case 'color-logic': return 'bg-purple-500';
      case 'shape-creation': return 'bg-blue-500';
      case 'sequence-art': return 'bg-green-500';
      case 'innovation': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderVisualElements = () => {
    if (!puzzle.visualElements) return null;

    const { colors, shapes, pattern } = puzzle.visualElements;

    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Visual Pattern
        </h4>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {colors.map((color, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.2, type: "spring" }}
              className="relative"
            >
              <div 
                className={`w-16 h-16 rounded-full border-4 border-white shadow-lg ${
                  index === colors.length - 1 && pattern[index] === '?' 
                    ? 'bg-gray-200 border-dashed border-gray-400' 
                    : ''
                }`}
                style={{ 
                  backgroundColor: pattern[index] === '?' ? 'transparent' : color 
                }}
              />
              {pattern[index] === '?' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">?</span>
                </div>
              )}
              <div className="text-center mt-2 text-sm font-medium text-gray-600">
                {pattern[index] !== '?' ? pattern[index] : '?'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderColorMixing = () => {
    if (puzzle.type !== 'color-logic' || !puzzle.visualElements) return null;

    const { colors } = puzzle.visualElements;

    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Brush className="h-5 w-5" />
          Color Mixing
        </h4>
        
        <div className="flex items-center justify-center gap-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div 
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              style={{ backgroundColor: colors[0] }}
            />
            <div className="mt-2 text-sm font-semibold">Color 1</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-400"
          >
            +
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div 
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              style={{ backgroundColor: colors[1] }}
            />
            <div className="mt-2 text-sm font-semibold">Color 2</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
            className="text-3xl font-bold text-gray-400"
          >
            =
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-gray-400 bg-gray-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400">?</span>
            </div>
            <div className="mt-2 text-sm font-semibold">Result</div>
          </motion.div>
        </div>
      </div>
    );
  };

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl mb-6"
                whileHover={{ scale: 1.05 }}
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Palette className="h-10 w-10 text-white" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Creative Puzzles
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Unleash your creativity with artistic puzzles, color logic, and innovative problem-solving challenges!
              </p>

              {answeredPuzzles.length > 0 && (
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Creative Results</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-pink-600">{score}</div>
                      <div className="text-gray-600">Creativity Score</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">{correctAnswers.length}</div>
                      <div className="text-gray-600">Solved</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600">
                        {((correctAnswers.length / answeredPuzzles.length) * 100).toFixed(0)}%
                      </div>
                      <div className="text-gray-600">Innovation Rate</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="h-6 w-6" />
              {answeredPuzzles.length > 0 ? 'Create Again' : 'Start Creating'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-xl">
                <Palette className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Creative Puzzles</h1>
                <p className="text-gray-600">Puzzle {currentPuzzle + 1} of {puzzlesOrder.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-pink-600" />
                <span className="text-pink-600">{formatTime(timeLeft)}</span>
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
              className="bg-gradient-to-r from-pink-600 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentPuzzle + 1) / puzzlesOrder.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Puzzle Content */}
        <motion.div
          key={currentPuzzle}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Puzzle Header */}
          <div className="flex items-center gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(puzzle.difficulty)}`}>
              Level {puzzle.difficulty}
            </span>
            <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getCategoryColor(puzzle.type)}`}>
              {puzzle.category}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="h-4 w-4" />
              <span className="capitalize">{puzzle.type.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Visual Elements */}
          {renderVisualElements()}
          {renderColorMixing()}

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{puzzle.question}</h2>

          {/* Multiple Choice Options */}
          {puzzle.options && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {puzzle.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={answeredPuzzles.includes(currentPuzzle)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedAnswer === option
                      ? correctAnswers.includes(currentPuzzle)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Hint Button */}
          {puzzle.hint && !showHint && !showExplanation && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHint(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg mb-6 hover:bg-yellow-200 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              Creative Hint
            </motion.button>
          )}

          {/* Hint Display */}
          <AnimatePresence>
            {showHint && puzzle.hint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Creative Hint:</h4>
                    <p className="text-yellow-700">{puzzle.hint}</p>
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
                  correctAnswers.includes(currentPuzzle)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  {correctAnswers.includes(currentPuzzle) ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  ) : (
                    <X className="h-6 w-6 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-bold text-lg mb-2 ${
                      correctAnswers.includes(currentPuzzle) ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {correctAnswers.includes(currentPuzzle) ? 'Creative Genius!' : 'Keep Exploring!'}
                    </h4>
                    <p className={`mb-4 ${
                      correctAnswers.includes(currentPuzzle) ? 'text-green-700' : 'text-red-700'
                    }`}>
                      The creative answer is: <strong>{puzzle.correctAnswer}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Creative Explanation:
                  </h5>
                  <p className="text-gray-700">{puzzle.explanation}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextPuzzle}
                  className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
                >
                  {currentPuzzle < puzzlesOrder.length - 1 ? 'Next Creation' : 'Finish Masterpiece'}
                  {currentPuzzle < puzzlesOrder.length - 1 && <Target className="h-5 w-5" />}
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
              New Canvas
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
} 