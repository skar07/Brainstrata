'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Target, Clock, Star, CheckCircle, RefreshCw, Home } from 'lucide-react';

interface HiddenObject {
  id: string;
  name: string;
  x: number;
  y: number;
  found: boolean;
  emoji: string;
}

const scenarios = [
  {
    id: 'forest',
    title: 'Enchanted Forest',
    description: 'Find the hidden magical items in this mystical forest',
    background: 'bg-gradient-to-br from-green-400 via-green-500 to-green-700',
    objects: [
      { id: '1', name: 'Magic Mushroom', x: 20, y: 60, found: false, emoji: '🍄' },
      { id: '2', name: 'Golden Key', x: 70, y: 30, found: false, emoji: '🗝️' },
      { id: '3', name: 'Crystal Gem', x: 40, y: 80, found: false, emoji: '💎' },
      { id: '4', name: 'Fairy Wing', x: 85, y: 70, found: false, emoji: '🧚' },
      { id: '5', name: 'Magic Wand', x: 15, y: 25, found: false, emoji: '🪄' }
    ]
  },
  {
    id: 'ocean',
    title: 'Ocean Depths',
    description: 'Discover treasures hidden in the deep blue sea',
    background: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700',
    objects: [
      { id: '1', name: 'Treasure Chest', x: 30, y: 70, found: false, emoji: '💰' },
      { id: '2', name: 'Starfish', x: 60, y: 40, found: false, emoji: '⭐' },
      { id: '3', name: 'Seahorse', x: 80, y: 60, found: false, emoji: '🐎' },
      { id: '4', name: 'Pearl', x: 25, y: 35, found: false, emoji: '🤍' },
      { id: '5', name: 'Anchor', x: 75, y: 80, found: false, emoji: '⚓' }
    ]
  },
  {
    id: 'space',
    title: 'Space Adventure',
    description: 'Spot the cosmic objects floating in the galaxy',
    background: 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700',
    objects: [
      { id: '1', name: 'Alien Ship', x: 45, y: 25, found: false, emoji: '🛸' },
      { id: '2', name: 'Space Rocket', x: 70, y: 55, found: false, emoji: '🚀' },
      { id: '3', name: 'Planet Ring', x: 20, y: 70, found: false, emoji: '🪐' },
      { id: '4', name: 'Asteroid', x: 85, y: 35, found: false, emoji: '☄️' },
      { id: '5', name: 'Satellite', x: 35, y: 80, found: false, emoji: '🛰️' }
    ]
  }
];

export default function ImageFinder() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [objects, setObjects] = useState<HiddenObject[]>(scenarios[0].objects);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [foundObjects, setFoundObjects] = useState<string[]>([]);

  useEffect(() => {
    setObjects(scenarios[currentScenario].objects);
    setFoundObjects([]);
    setScore(0);
    setGameCompleted(false);
  }, [currentScenario]);

  useEffect(() => {
    if (gameActive && timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || gameCompleted) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive, gameCompleted]);

  useEffect(() => {
    if (foundObjects.length === objects.length && objects.length > 0) {
      setGameCompleted(true);
      setGameActive(false);
    }
  }, [foundObjects, objects]);

  const startGame = () => {
    setGameActive(true);
    setTimeLeft(60);
    setScore(0);
    setFoundObjects([]);
    setGameCompleted(false);
    setObjects(scenarios[currentScenario].objects.map(obj => ({ ...obj, found: false })));
  };

  const handleObjectClick = (objectId: string) => {
    if (!gameActive || foundObjects.includes(objectId)) return;

    setFoundObjects([...foundObjects, objectId]);
    setScore(score + 100);
    
    setObjects(objects.map(obj => 
      obj.id === objectId ? { ...obj, found: true } : obj
    ));
  };

  const nextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % scenarios.length);
  };

  const scenario = scenarios[currentScenario];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🔍 Image Finder Challenge
          </h1>
          <p className="text-lg text-gray-600">
            Find all hidden objects in the scene before time runs out!
          </p>
        </motion.div>

        {/* Game Stats */}
        <motion.div 
          className="flex justify-center items-center gap-8 mb-6"
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
              <Target className="h-5 w-5 text-green-500" />
              <span className="font-bold text-gray-800">
                Found: {foundObjects.length}/{objects.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Scenario Selector */}
        <div className="flex justify-center gap-4 mb-6">
          {scenarios.map((s, index) => (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentScenario(index)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                index === currentScenario
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {s.title}
            </motion.button>
          ))}
        </div>

        {/* Game Area */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`relative w-full h-96 rounded-2xl ${scenario.background} overflow-hidden shadow-2xl cursor-crosshair`}>
            {/* Background Animation */}
            <motion.div 
              className="absolute inset-0 opacity-20"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {/* Hidden Objects */}
            {objects.map((object) => (
              <motion.div
                key={object.id}
                className="absolute cursor-pointer"
                style={{ left: `${object.x}%`, top: `${object.y}%` }}
                onClick={() => handleObjectClick(object.id)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0.7 }}
                animate={{ 
                  opacity: foundObjects.includes(object.id) ? 1 : 0.7,
                  scale: foundObjects.includes(object.id) ? [1, 1.3, 1] : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <div className={`relative ${foundObjects.includes(object.id) ? 'pointer-events-none' : ''}`}>
                  <motion.div
                    className="text-3xl select-none"
                    animate={foundObjects.includes(object.id) ? {} : { 
                      y: [0, -5, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {object.emoji}
                  </motion.div>
                  
                  {foundObjects.includes(object.id) && (
                    <motion.div
                      className="absolute -top-2 -right-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Game Over Overlay */}
            <AnimatePresence>
              {(!gameActive && (gameCompleted || timeLeft === 0)) && (
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white rounded-2xl p-8 text-center max-w-md mx-4"
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 20 }}
                  >
                    <h3 className="text-2xl font-bold mb-4">
                      {gameCompleted ? '🎉 Congratulations!' : '⏰ Time\'s Up!'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You found {foundObjects.length} out of {objects.length} objects
                    </p>
                    <p className="text-xl font-bold text-blue-600 mb-6">
                      Final Score: {score}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startGame}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Play Again
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextScenario}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Next Scene
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Object List */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-center mb-4">Objects to Find:</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {objects.map((object) => (
              <motion.div
                key={object.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  foundObjects.includes(object.id)
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-white text-gray-700 border-2 border-gray-200'
                }`}
                animate={foundObjects.includes(object.id) ? { scale: [1, 1.1, 1] } : {}}
              >
                <span className="text-xl">{object.emoji}</span>
                <span className="font-medium">{object.name}</span>
                {foundObjects.includes(object.id) && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        {!gameActive && !gameCompleted && timeLeft === 60 && (
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🚀 Start Game
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 