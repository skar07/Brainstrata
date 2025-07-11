'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Puzzle, RotateCcw, CheckCircle, Star, Trophy, Timer, 
  Lightbulb, RefreshCw, Zap, Target, Award, ArrowLeft 
} from 'lucide-react';

interface PuzzlePiece {
  id: string;
  position: { x: number; y: number };
  correctPosition: { x: number; y: number };
  shape: 'square' | 'triangle' | 'circle' | 'hexagon';
  color: string;
  isPlaced: boolean;
}

interface Puzzle {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  pieces: PuzzlePiece[];
  gridSize: number;
  timeLimit: number;
  description: string;
}

const puzzles: Puzzle[] = [
  {
    id: 'color-pattern',
    name: 'Color Pattern Puzzle',
    difficulty: 'Easy',
    description: 'Arrange the colored shapes in the correct pattern',
    timeLimit: 120,
    gridSize: 3,
    pieces: [
      { id: '1', position: { x: 0, y: 0 }, correctPosition: { x: 1, y: 1 }, shape: 'circle', color: 'bg-red-500', isPlaced: false },
      { id: '2', position: { x: 1, y: 0 }, correctPosition: { x: 2, y: 1 }, shape: 'square', color: 'bg-blue-500', isPlaced: false },
      { id: '3', position: { x: 2, y: 0 }, correctPosition: { x: 1, y: 2 }, shape: 'triangle', color: 'bg-green-500', isPlaced: false },
      { id: '4', position: { x: 0, y: 1 }, correctPosition: { x: 0, y: 1 }, shape: 'hexagon', color: 'bg-yellow-500', isPlaced: false },
    ]
  },
  {
    id: 'shape-sequence',
    name: 'Shape Sequence',
    difficulty: 'Medium',
    description: 'Complete the sequence by placing shapes in order',
    timeLimit: 180,
    gridSize: 4,
    pieces: [
      { id: '1', position: { x: 0, y: 0 }, correctPosition: { x: 0, y: 0 }, shape: 'circle', color: 'bg-purple-500', isPlaced: false },
      { id: '2', position: { x: 1, y: 0 }, correctPosition: { x: 1, y: 0 }, shape: 'square', color: 'bg-pink-500', isPlaced: false },
      { id: '3', position: { x: 2, y: 0 }, correctPosition: { x: 2, y: 0 }, shape: 'triangle', color: 'bg-indigo-500', isPlaced: false },
      { id: '4', position: { x: 3, y: 0 }, correctPosition: { x: 3, y: 0 }, shape: 'hexagon', color: 'bg-teal-500', isPlaced: false },
      { id: '5', position: { x: 0, y: 1 }, correctPosition: { x: 0, y: 1 }, shape: 'circle', color: 'bg-orange-500', isPlaced: false },
      { id: '6', position: { x: 1, y: 1 }, correctPosition: { x: 1, y: 1 }, shape: 'square', color: 'bg-cyan-500', isPlaced: false },
    ]
  }
];

export default function PuzzleSolver({ onBack }: { onBack?: () => void }) {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(puzzles[0]);
  const [pieces, setPieces] = useState<PuzzlePiece[]>(currentPuzzle.pieces);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(currentPuzzle.timeLimit);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const completed = pieces.every(piece => piece.isPlaced);
    if (completed && !isCompleted) {
      setIsCompleted(true);
      const timeBonus = Math.max(0, timeLeft * 10);
      const movesPenalty = Math.max(0, moves * 5);
      setScore(1000 + timeBonus - movesPenalty);
    }
  }, [pieces, isCompleted, timeLeft, moves]);

  const handleDragStart = (pieceId: string) => {
    setDraggedPiece(pieceId);
  };

  const handleDrop = (targetX: number, targetY: number) => {
    if (!draggedPiece) return;

    setPieces(prev => prev.map(piece => {
      if (piece.id === draggedPiece) {
        const isCorrectPosition = 
          piece.correctPosition.x === targetX && piece.correctPosition.y === targetY;
        
        setMoves(prev => prev + 1);
        
        return {
          ...piece,
          position: { x: targetX, y: targetY },
          isPlaced: isCorrectPosition
        };
      }
      return piece;
    }));

    setDraggedPiece(null);
  };

  const resetPuzzle = () => {
    setPieces(currentPuzzle.pieces.map(piece => ({ ...piece, isPlaced: false })));
    setIsCompleted(false);
    setTimeLeft(currentPuzzle.timeLimit);
    setScore(0);
    setMoves(0);
    setShowHint(false);
  };

  const nextPuzzle = () => {
    const currentIndex = puzzles.findIndex(p => p.id === currentPuzzle.id);
    const nextIndex = (currentIndex + 1) % puzzles.length;
    const nextPuzzle = puzzles[nextIndex];
    
    setCurrentPuzzle(nextPuzzle);
    setPieces(nextPuzzle.pieces.map(piece => ({ ...piece, isPlaced: false })));
    setIsCompleted(false);
    setTimeLeft(nextPuzzle.timeLimit);
    setScore(0);
    setMoves(0);
    setShowHint(false);
  };

  const renderShape = (piece: PuzzlePiece, isPreview = false) => {
    const baseClasses = `w-12 h-12 ${piece.color} ${isPreview ? 'opacity-30' : ''} ${
      piece.isPlaced ? 'ring-2 ring-green-400' : ''
    }`;

    switch (piece.shape) {
      case 'circle':
        return <div className={`${baseClasses} rounded-full`} />;
      case 'square':
        return <div className={`${baseClasses} rounded-lg`} />;
      case 'triangle':
        return (
          <div 
            className={`${baseClasses} transform rotate-45`}
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
        );
      case 'hexagon':
        return (
          <div 
            className={`${baseClasses}`}
            style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
          />
        );
      default:
        return <div className={baseClasses} />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            {onBack && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </motion.button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Puzzle className="h-8 w-8 text-purple-600" />
                Puzzle Solver
              </h1>
              <p className="text-gray-600">Drag and drop shapes to solve interactive puzzles</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              Hint
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetPuzzle}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </motion.button>
          </div>
        </motion.div>

        {/* Game Stats */}
        <motion.div 
          className="grid grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-red-500" />
              <span className="font-semibold">Time</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">Moves</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{moves}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Score</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{score}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Difficulty</span>
            </div>
            <div className="text-lg font-bold text-green-600">{currentPuzzle.difficulty}</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Puzzle Grid */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4">{currentPuzzle.name}</h2>
            <p className="text-gray-600 mb-6">{currentPuzzle.description}</p>
            
            <div 
              className="grid gap-2 mx-auto w-fit"
              style={{ 
                gridTemplateColumns: `repeat(${currentPuzzle.gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${currentPuzzle.gridSize}, 1fr)`
              }}
            >
              {Array.from({ length: currentPuzzle.gridSize * currentPuzzle.gridSize }).map((_, index) => {
                const x = index % currentPuzzle.gridSize;
                const y = Math.floor(index / currentPuzzle.gridSize);
                const placedPiece = pieces.find(piece => 
                  piece.position.x === x && piece.position.y === y
                );
                const correctPiece = pieces.find(piece => 
                  piece.correctPosition.x === x && piece.correctPosition.y === y
                );

                return (
                  <motion.div
                    key={index}
                    className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(x, y)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Show hint */}
                    {showHint && correctPiece && !placedPiece && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {renderShape(correctPiece, true)}
                      </motion.div>
                    )}
                    
                    {/* Placed piece */}
                    {placedPiece && (
                      <motion.div
                        key={placedPiece.id}
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="cursor-grab active:cursor-grabbing"
                        draggable
                        onDragStart={() => handleDragStart(placedPiece.id)}
                      >
                        {renderShape(placedPiece)}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Pieces Panel */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">Puzzle Pieces</h2>
            <p className="text-gray-600 mb-6">Drag pieces to the correct positions</p>
            
            <div className="grid grid-cols-3 gap-4">
              {pieces.filter(piece => !piece.isPlaced).map((piece) => (
                <motion.div
                  key={piece.id}
                  className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:border-blue-400 transition-colors"
                  draggable
                  onDragStart={() => handleDragStart(piece.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    y: draggedPiece === piece.id ? -5 : 0,
                    rotate: draggedPiece === piece.id ? 5 : 0
                  }}
                >
                  {renderShape(piece)}
                </motion.div>
              ))}
            </div>

            {pieces.filter(piece => !piece.isPlaced).length === 0 && !isCompleted && (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-600">All pieces are placed!</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Completion Modal */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 50 }}
                className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1 }}
                  className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Award className="h-10 w-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Puzzle Completed!</h3>
                <p className="text-gray-600 mb-4">Great job solving the puzzle!</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Final Score:</span>
                      <div className="font-bold text-lg text-blue-600">{score}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Moves Used:</span>
                      <div className="font-bold text-lg text-purple-600">{moves}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetPuzzle}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextPuzzle}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Next Puzzle
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 