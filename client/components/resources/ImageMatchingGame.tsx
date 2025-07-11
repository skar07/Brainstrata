'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCcw, Star, Trophy, Sparkles } from 'lucide-react';

interface ImagePair {
  id: string;
  category: string;
  items: {
    id: string;
    name: string;
    emoji: string;
    description: string;
  }[];
}

const imagePairs: ImagePair[] = [
  {
    id: 'animals',
    category: 'Animals & Their Homes',
    items: [
      { id: 'bee', name: 'Bee', emoji: '🐝', description: 'Makes honey' },
      { id: 'hive', name: 'Hive', emoji: '🏠', description: 'Bee home' },
      { id: 'bird', name: 'Bird', emoji: '🐦', description: 'Flies in sky' },
      { id: 'nest', name: 'Nest', emoji: '🪺', description: 'Bird home' },
      { id: 'fish', name: 'Fish', emoji: '🐟', description: 'Swims in water' },
      { id: 'ocean', name: 'Ocean', emoji: '🌊', description: 'Fish home' }
    ]
  },
  {
    id: 'shapes',
    category: 'Shapes & Colors',
    items: [
      { id: 'red-circle', name: 'Red Circle', emoji: '🔴', description: 'Round and red' },
      { id: 'red-square', name: 'Red Square', emoji: '🟥', description: 'Square and red' },
      { id: 'blue-circle', name: 'Blue Circle', emoji: '🔵', description: 'Round and blue' },
      { id: 'blue-square', name: 'Blue Square', emoji: '🟦', description: 'Square and blue' },
      { id: 'yellow-circle', name: 'Yellow Circle', emoji: '🟡', description: 'Round and yellow' },
      { id: 'yellow-square', name: 'Yellow Square', emoji: '🟨', description: 'Square and yellow' }
    ]
  },
  {
    id: 'food',
    category: 'Food & Origins',
    items: [
      { id: 'apple', name: 'Apple', emoji: '🍎', description: 'Red fruit' },
      { id: 'tree', name: 'Tree', emoji: '🌳', description: 'Grows apples' },
      { id: 'milk', name: 'Milk', emoji: '🥛', description: 'White drink' },
      { id: 'cow', name: 'Cow', emoji: '🐄', description: 'Gives milk' },
      { id: 'honey', name: 'Honey', emoji: '🍯', description: 'Sweet golden' },
      { id: 'bee-worker', name: 'Bee', emoji: '🐝', description: 'Makes honey' }
    ]
  }
];

export default function ImageMatchingGame() {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<typeof imagePairs[0]['items']>([]);
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedPairs, setCompletedPairs] = useState<string[]>([]);

  const currentPair = imagePairs[currentPairIndex];

  useEffect(() => {
    resetGame();
  }, [currentPairIndex]);

  const resetGame = () => {
    const shuffled = [...currentPair.items].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    setMatches({});
    setDraggedItem(null);
    setShowSuccess(false);
  };

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedItemData = currentPair.items.find(item => item.id === draggedItem);
    const targetItemData = currentPair.items.find(item => item.id === targetId);

    if (!draggedItemData || !targetItemData || draggedItem === targetId) return;

    // Check if they form a valid pair
    const isValidPair = checkValidPair(draggedItemData, targetItemData);
    
    if (isValidPair) {
      setMatches(prev => ({
        ...prev,
        [draggedItem]: targetId,
        [targetId]: draggedItem
      }));
      setScore(prev => prev + 10);
      
      // Check if all pairs are matched
      const newMatches = {
        ...matches,
        [draggedItem]: targetId,
        [targetId]: draggedItem
      };
      
      if (Object.keys(newMatches).length === currentPair.items.length) {
        setShowSuccess(true);
        setCompletedPairs(prev => [...prev, currentPair.id]);
        setTimeout(() => {
          if (currentPairIndex < imagePairs.length - 1) {
            setCurrentPairIndex(prev => prev + 1);
          }
        }, 2000);
      }
    }
    
    setDraggedItem(null);
  };

  const checkValidPair = (item1: any, item2: any) => {
    const pairs = [
      ['bee', 'hive'], ['bird', 'nest'], ['fish', 'ocean'],
      ['red-circle', 'red-square'], ['blue-circle', 'blue-square'], ['yellow-circle', 'yellow-square'],
      ['apple', 'tree'], ['milk', 'cow'], ['honey', 'bee-worker']
    ];
    
    return pairs.some(pair => 
      (pair.includes(item1.id) && pair.includes(item2.id)) ||
      (pair.includes(item2.id) && pair.includes(item1.id))
    );
  };

  const nextChallenge = () => {
    if (currentPairIndex < imagePairs.length - 1) {
      setCurrentPairIndex(prev => prev + 1);
    } else {
      setCurrentPairIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧩 Image Matching Challenge
          </h1>
          <p className="text-gray-600 text-lg">
            Drag and drop to match related items!
          </p>
          
          <div className="flex items-center justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-gray-700">Score: {score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              <span className="font-semibold text-gray-700">
                Level: {currentPairIndex + 1}/{imagePairs.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Current Category */}
        <motion.div
          key={currentPair.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {currentPair.category}
          </h2>

          {/* Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {shuffledItems.map((item, index) => {
              const isMatched = matches[item.id];
              const isBeingDragged = draggedItem === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    relative bg-white rounded-xl shadow-md p-4 cursor-pointer transition-all duration-300
                    ${isMatched ? 'ring-4 ring-green-400 bg-green-50' : 'hover:shadow-lg hover:scale-105'}
                    ${isBeingDragged ? 'opacity-50 scale-95' : ''}
                  `}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.id)}
                >
                  {isMatched && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  )}
                  
                  <div className="text-center">
                    <motion.div 
                      className="text-4xl mb-2"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      {item.emoji}
                    </motion.div>
                    <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="bg-white rounded-3xl p-8 text-center max-w-md mx-4"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: 2
                  }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Perfect Match!
                </h3>
                <p className="text-gray-600 mb-4">
                  You successfully matched all pairs in {currentPair.category}!
                </p>
                <div className="flex items-center justify-center gap-2 text-yellow-500">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">+{Object.keys(matches).length * 5} Bonus Points!</span>
                  <Sparkles className="h-5 w-5" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
            Reset
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextChallenge}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
          >
            Next Challenge
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.button>
        </div>

        {/* Progress */}
        <motion.div 
          className="mt-8 bg-white rounded-xl p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Progress</h3>
          <div className="flex justify-center gap-2">
            {imagePairs.map((pair, index) => (
              <motion.div
                key={pair.id}
                className={`
                  w-4 h-4 rounded-full transition-all duration-300
                  ${completedPairs.includes(pair.id) ? 'bg-green-500' : 
                    index === currentPairIndex ? 'bg-blue-500' : 'bg-gray-300'}
                `}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 