'use client';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, RotateCcw, Save, Target, Star, Trophy, Shuffle, Plus } from 'lucide-react';

interface DroppedShape {
  id: string;
  type: string;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  targetImage: string;
  difficulty: number;
  requiredShapes: { type: string; count: number }[];
}

const shapes = [
  { type: 'circle', name: 'Circle', emoji: '🔴' },
  { type: 'square', name: 'Square', emoji: '🟩' },
  { type: 'triangle', name: 'Triangle', emoji: '🔺' },
  { type: 'diamond', name: 'Diamond', emoji: '🔶' },
  { type: 'star', name: 'Star', emoji: '⭐' },
  { type: 'heart', name: 'Heart', emoji: '❤️' },
  { type: 'hexagon', name: 'Hexagon', emoji: '⬡' },
  { type: 'oval', name: 'Oval', emoji: '🥚' }
];

const colors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-cyan-500',
  'bg-indigo-500', 'bg-lime-500', 'bg-rose-500', 'bg-amber-500'
];

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Build a House',
    description: 'Create a simple house using squares and triangles',
    targetImage: '🏠',
    difficulty: 1,
    requiredShapes: [
      { type: 'square', count: 2 },
      { type: 'triangle', count: 1 }
    ]
  },
  {
    id: '2',
    title: 'Create a Flower',
    description: 'Make a colorful flower with circles and shapes',
    targetImage: '🌸',
    difficulty: 2,
    requiredShapes: [
      { type: 'circle', count: 5 },
      { type: 'oval', count: 1 }
    ]
  },
  {
    id: '3',
    title: 'Design a Robot',
    description: 'Build a robot using various geometric shapes',
    targetImage: '🤖',
    difficulty: 3,
    requiredShapes: [
      { type: 'square', count: 3 },
      { type: 'circle', count: 2 },
      { type: 'triangle', count: 2 }
    ]
  },
  {
    id: '4',
    title: 'Make a Butterfly',
    description: 'Create a beautiful butterfly with symmetrical shapes',
    targetImage: '🦋',
    difficulty: 3,
    requiredShapes: [
      { type: 'oval', count: 4 },
      { type: 'circle', count: 1 },
      { type: 'diamond', count: 2 }
    ]
  }
];

export default function ShapeBuilder() {
  const [mode, setMode] = useState<'creative' | 'challenge'>('creative');
  const [droppedShapes, setDroppedShapes] = useState<DroppedShape[]>([]);
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');
  const [selectedSize, setSelectedSize] = useState(60);
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const challenge = challenges[currentChallenge];

  const handleDragStart = (shapeType: string) => {
    setDraggedShape(shapeType);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedShape || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newShape: DroppedShape = {
      id: `shape-${Date.now()}-${Math.random()}`,
      type: draggedShape,
      x: x - selectedSize / 2,
      y: y - selectedSize / 2,
      color: selectedColor,
      size: selectedSize,
      rotation: 0
    };

    setDroppedShapes([...droppedShapes, newShape]);
    setDraggedShape(null);

    // Check challenge completion
    if (mode === 'challenge') {
      checkChallengeCompletion([...droppedShapes, newShape]);
    }
  }, [draggedShape, selectedColor, selectedSize, droppedShapes, mode]);

  const checkChallengeCompletion = (shapes: DroppedShape[]) => {
    const shapeCounts: { [key: string]: number } = {};
    shapes.forEach(shape => {
      shapeCounts[shape.type] = (shapeCounts[shape.type] || 0) + 1;
    });

    const isComplete = challenge.requiredShapes.every(req => 
      shapeCounts[req.type] >= req.count
    );

    if (isComplete && !completedChallenges.includes(challenge.id)) {
      setCompletedChallenges([...completedChallenges, challenge.id]);
      setScore(score + challenge.difficulty * 100);
      
      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          clearCanvas();
        }
      }, 2000);
    }
  };

  const rotateShape = (shapeId: string) => {
    setDroppedShapes(droppedShapes.map(shape => 
      shape.id === shapeId 
        ? { ...shape, rotation: (shape.rotation + 45) % 360 }
        : shape
    ));
  };

  const removeShape = (shapeId: string) => {
    setDroppedShapes(droppedShapes.filter(shape => shape.id !== shapeId));
  };

  const clearCanvas = () => {
    setDroppedShapes([]);
  };

  const generateRandomChallenge = () => {
    setCurrentChallenge(Math.floor(Math.random() * challenges.length));
    clearCanvas();
  };

  const getShapeComponent = (shape: DroppedShape) => {
    const baseClasses = `absolute cursor-pointer transition-all duration-200 hover:scale-110`;
    const sizeStyle = { width: shape.size, height: shape.size };
    const positionStyle = { 
      left: shape.x, 
      top: shape.y,
      transform: `rotate(${shape.rotation}deg)`
    };

    const handleClick = () => rotateShape(shape.id);
    const handleDoubleClick = () => removeShape(shape.id);

    switch (shape.type) {
      case 'circle':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses} ${shape.color} rounded-full`}
            style={{ ...sizeStyle, ...positionStyle }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              setDroppedShapes(droppedShapes.map(s => 
                s.id === shape.id 
                  ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y }
                  : s
              ));
            }}
          />
        );
      case 'square':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses} ${shape.color}`}
            style={{ ...sizeStyle, ...positionStyle }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              setDroppedShapes(droppedShapes.map(s => 
                s.id === shape.id 
                  ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y }
                  : s
              ));
            }}
          />
        );
      case 'triangle':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses}`}
            style={{ ...positionStyle, width: shape.size, height: shape.size }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              setDroppedShapes(droppedShapes.map(s => 
                s.id === shape.id 
                  ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y }
                  : s
              ));
            }}
          >
            <div 
              className={`w-0 h-0 ${shape.color.replace('bg-', 'border-b-')}`}
              style={{
                borderLeftWidth: shape.size / 2,
                borderRightWidth: shape.size / 2,
                borderBottomWidth: shape.size * 0.87,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent'
              }}
            />
          </motion.div>
        );
      case 'diamond':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses} ${shape.color} transform rotate-45`}
            style={{ ...sizeStyle, ...positionStyle, transform: `rotate(${45 + shape.rotation}deg)` }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              setDroppedShapes(droppedShapes.map(s => 
                s.id === shape.id 
                  ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y }
                  : s
              ));
            }}
          />
        );
      case 'star':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses} flex items-center justify-center`}
            style={{ ...sizeStyle, ...positionStyle }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              setDroppedShapes(droppedShapes.map(s => 
                s.id === shape.id 
                  ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y }
                  : s
              ));
            }}
          >
            <div className={`text-4xl ${shape.color.replace('bg-', 'text-')}`}>⭐</div>
          </motion.div>
        );
      case 'heart':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses} flex items-center justify-center`}
            style={{ ...sizeStyle, ...positionStyle }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              setDroppedShapes(droppedShapes.map(s => 
                s.id === shape.id 
                  ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y }
                  : s
              ));
            }}
          >
            <div className={`text-4xl ${shape.color.replace('bg-', 'text-')}`}>❤️</div>
          </motion.div>
        );
      case 'hexagon':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses} flex items-center justify-center`}
            style={{ ...sizeStyle, ...positionStyle }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              setDroppedShapes(droppedShapes.map(s => 
                s.id === shape.id 
                  ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y }
                  : s
              ));
            }}
          >
            <div className={`text-4xl ${shape.color.replace('bg-', 'text-')}`}>⬡</div>
          </motion.div>
        );
      case 'oval':
        return (
          <motion.div
            key={shape.id}
            className={`${baseClasses} ${shape.color} rounded-full`}
            style={{ 
              ...positionStyle, 
              width: shape.size, 
              height: shape.size * 0.6,
              transform: `rotate(${shape.rotation}deg)`
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              setDroppedShapes(droppedShapes.map(s => 
                s.id === shape.id 
                  ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y }
                  : s
              ));
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎨 Shape Builder Studio
          </h1>
          <p className="text-lg text-gray-600">
            Create amazing designs with draggable shapes and complete building challenges!
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('creative')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              mode === 'creative'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🎨 Creative Mode
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('challenge')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              mode === 'challenge'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🎯 Challenge Mode
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tool Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shape Palette */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Shape Palette
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {shapes.map((shape) => (
                  <motion.div
                    key={shape.type}
                    className="bg-gray-100 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:bg-gray-200 transition-colors text-center"
                    draggable
                    onDragStart={() => handleDragStart(shape.type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl mb-2">{shape.emoji}</div>
                    <div className="text-xs font-medium">{shape.name}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Color Selector */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4">Colors</h3>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <motion.button
                    key={color}
                    className={`w-8 h-8 rounded-lg ${color} ${
                      selectedColor === color ? 'ring-4 ring-gray-400' : ''
                    }`}
                    onClick={() => setSelectedColor(color)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Size Selector */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Size</h3>
              <input
                type="range"
                min="20"
                max="120"
                value={selectedSize}
                onChange={(e) => setSelectedSize(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-2">
                {selectedSize}px
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4">Controls</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearCanvas}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </motion.button>
                
                {mode === 'challenge' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateRandomChallenge}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Shuffle className="h-4 w-4" />
                    Random Challenge
                  </motion.button>
                )}
              </div>
            </motion.div>

            {mode === 'challenge' && (
              <motion.div 
                className="bg-white rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Score: {score}
                </h3>
                <div className="text-sm text-gray-600">
                  Completed: {completedChallenges.length}/{challenges.length}
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3 space-y-6">
            {mode === 'challenge' && (
              <motion.div 
                className="bg-white rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{challenge.targetImage}</div>
                    <div>
                      <h3 className="text-xl font-bold">{challenge.title}</h3>
                      <p className="text-gray-600">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: challenge.difficulty }, (_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Required Shapes:</h4>
                  <div className="flex gap-4">
                    {challenge.requiredShapes.map((req, index) => {
                      const shape = shapes.find(s => s.type === req.type);
                      const usedCount = droppedShapes.filter(s => s.type === req.type).length;
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-xl">{shape?.emoji}</span>
                          <span className={`font-medium ${
                            usedCount >= req.count ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {usedCount}/{req.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {completedChallenges.includes(challenge.id) && (
                  <motion.div 
                    className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Trophy className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-green-800">Challenge Completed! 🎉</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Canvas */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">
                  {mode === 'creative' ? '🎨 Creative Canvas' : '🎯 Build Area'}
                </h3>
                <p className="text-sm text-gray-600">
                  Drag shapes from the palette. Click to rotate, double-click to remove.
                </p>
              </div>
              
              <div
                ref={canvasRef}
                className="relative bg-gradient-to-br from-blue-50 to-purple-50 h-96 lg:h-[500px]"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
              >
                <AnimatePresence>
                  {droppedShapes.map(shape => getShapeComponent(shape))}
                </AnimatePresence>
                
                {droppedShapes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Drag shapes here to start building!</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 