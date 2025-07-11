'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Eye, RotateCcw, Trophy, Clock, Star, Shuffle } from 'lucide-react';

interface Card {
  id: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface SequenceItem {
  id: string;
  emoji: string;
  color: string;
}

type GameMode = 'card-match' | 'sequence' | 'visual';

const emojis = ['🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎹', '🚀', '🌟', '🦄', '🐸', '🦋', '🌸', '⚡', '🔥', '💎', '🍀'];
const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-orange-400'];

export default function MemoryGames() {
  const [gameMode, setGameMode] = useState<GameMode>('card-match');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameActive, setGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Sequence game state
  const [sequence, setSequence] = useState<SequenceItem[]>([]);
  const [playerSequence, setPlayerSequence] = useState<SequenceItem[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [sequenceLevel, setSequenceLevel] = useState(1);
  const [sequenceIndex, setSequenceIndex] = useState(0);

  // Visual memory state
  const [visualPattern, setVisualPattern] = useState<number[]>([]);
  const [playerPattern, setPlayerPattern] = useState<number[]>([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const [patternLevel, setPatternLevel] = useState(1);

  useEffect(() => {
    if (gameActive && timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive, gameCompleted]);

  useEffect(() => {
    if (gameMode === 'card-match' && matches * 2 === cards.length && cards.length > 0) {
      setGameCompleted(true);
      setScore(score + Math.max(1000 - moves * 10, 100));
    }
  }, [matches, cards.length, gameMode]);

  const initializeCardGame = () => {
    const gameEmojis = emojis.slice(0, 8);
    const cardPairs = [...gameEmojis, ...gameEmojis];
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: `card-${index}`,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
  };

  const initializeSequenceGame = () => {
    const newSequence = Array.from({ length: sequenceLevel + 2 }, (_, i) => ({
      id: `seq-${i}`,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setSequence(newSequence);
    setPlayerSequence([]);
    setSequenceIndex(0);
    showSequence(newSequence);
  };

  const initializeVisualGame = () => {
    const gridSize = 4 + patternLevel;
    const patternLength = Math.min(3 + patternLevel, gridSize * gridSize / 2);
    const newPattern = Array.from({ length: patternLength }, () => 
      Math.floor(Math.random() * (gridSize * gridSize))
    );
    setVisualPattern(newPattern);
    setPlayerPattern([]);
    showPattern(newPattern);
  };

  const showSequence = (seq: SequenceItem[]) => {
    setShowingSequence(true);
    seq.forEach((item, index) => {
      setTimeout(() => {
        setSequenceIndex(index);
        if (index === seq.length - 1) {
          setTimeout(() => {
            setShowingSequence(false);
            setSequenceIndex(0);
          }, 800);
        }
      }, index * 800);
    });
  };

  const showPattern = (pattern: number[]) => {
    setShowingPattern(true);
    setTimeout(() => {
      setShowingPattern(false);
    }, 2000 + patternLevel * 500);
  };

  const startGame = (mode: GameMode = gameMode) => {
    setGameMode(mode);
    setGameActive(true);
    setTimeLeft(120);
    setScore(0);
    setGameCompleted(false);
    
    switch (mode) {
      case 'card-match':
        initializeCardGame();
        break;
      case 'sequence':
        setSequenceLevel(1);
        initializeSequenceGame();
        break;
      case 'visual':
        setPatternLevel(1);
        initializeVisualGame();
        break;
    }
  };

  const handleCardClick = (cardId: string) => {
    if (!gameActive || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlippedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard?.emoji === secondCard?.emoji) {
        // Match found
        setMatches(matches + 1);
        setScore(score + 50);
        setTimeout(() => {
          setCards(cards.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isMatched: true }
              : c
          ));
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleSequenceClick = (item: SequenceItem) => {
    if (showingSequence || !gameActive) return;

    const newPlayerSequence = [...playerSequence, item];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence.length === sequence.length) {
      const isCorrect = newPlayerSequence.every((item, index) => 
        item.emoji === sequence[index].emoji
      );

      if (isCorrect) {
        setScore(score + sequenceLevel * 50);
        setSequenceLevel(sequenceLevel + 1);
        setTimeout(() => initializeSequenceGame(), 1000);
      } else {
        setTimeout(() => {
          setPlayerSequence([]);
          initializeSequenceGame();
        }, 1000);
      }
    }
  };

  const handleVisualClick = (index: number) => {
    if (showingPattern || !gameActive) return;

    const newPlayerPattern = [...playerPattern, index];
    setPlayerPattern(newPlayerPattern);

    if (newPlayerPattern.length === visualPattern.length) {
      const isCorrect = newPlayerPattern.every((pos, i) => pos === visualPattern[i]);

      if (isCorrect) {
        setScore(score + patternLevel * 75);
        setPatternLevel(patternLevel + 1);
        setTimeout(() => initializeVisualGame(), 1000);
      } else {
        setTimeout(() => {
          setPlayerPattern([]);
          initializeVisualGame();
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setGameActive(false);
    setGameCompleted(false);
    setScore(0);
    setTimeLeft(120);
    
    switch (gameMode) {
      case 'card-match':
        initializeCardGame();
        break;
      case 'sequence':
        setSequenceLevel(1);
        setPlayerSequence([]);
        break;
      case 'visual':
        setPatternLevel(1);
        setPlayerPattern([]);
        break;
    }
  };

  const renderCardGame = () => (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Flip cards to find matching pairs!</p>
        <div className="flex justify-center gap-4 text-sm">
          <span>Moves: {moves}</span>
          <span>Matches: {matches}/{cards.length / 2}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="aspect-square cursor-pointer"
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back of card */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Brain className="h-8 w-8 text-white" />
              </div>
              
              {/* Front of card */}
              <div 
                className="absolute inset-0 bg-white rounded-xl shadow-lg flex items-center justify-center text-4xl border-2 border-gray-200"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                {card.emoji}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSequenceGame = () => (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Watch the sequence, then repeat it in order!
        </p>
        <p className="text-sm text-gray-500">Level: {sequenceLevel}</p>
      </div>

      {/* Sequence Display */}
      <div className="bg-gray-100 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-center mb-4">
          {showingSequence ? 'Watch Carefully!' : 'Your Turn!'}
        </h3>
        <div className="flex justify-center gap-2 mb-4 min-h-[60px]">
          {sequence.map((item, index) => (
            <motion.div
              key={item.id}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${item.color} ${
                showingSequence && index === sequenceIndex ? 'ring-4 ring-yellow-400' : ''
              }`}
              animate={showingSequence && index === sequenceIndex ? { scale: [1, 1.3, 1] } : {}}
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Player Input */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-center mb-4">Repeat the sequence:</h3>
        <div className="flex justify-center gap-2 mb-4 min-h-[60px]">
          {playerSequence.map((item, index) => (
            <motion.div
              key={`player-${index}`}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${item.color}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-6 gap-4 justify-items-center">
          {emojis.slice(0, 12).map((emoji, index) => (
            <motion.button
              key={emoji}
              className={`w-12 h-12 rounded-lg ${colors[index % colors.length]} flex items-center justify-center text-2xl hover:scale-110 transition-transform`}
              onClick={() => handleSequenceClick({ 
                id: `option-${emoji}`, 
                emoji, 
                color: colors[index % colors.length] 
              })}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={showingSequence}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVisualGame = () => {
    const gridSize = 4 + patternLevel;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Remember the highlighted squares, then click them in order!
          </p>
          <p className="text-sm text-gray-500">Level: {patternLevel}</p>
        </div>

        <div className="flex justify-center">
          <div 
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {Array.from({ length: gridSize * gridSize }, (_, index) => (
              <motion.button
                key={index}
                className={`w-12 h-12 rounded-lg transition-all duration-300 ${
                  showingPattern && visualPattern.includes(index)
                    ? 'bg-yellow-400 border-2 border-yellow-600'
                    : playerPattern.includes(index)
                    ? 'bg-green-400 border-2 border-green-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handleVisualClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={showingPattern}
                animate={showingPattern && visualPattern.includes(index) 
                  ? { scale: [1, 1.2, 1] } 
                  : {}
                }
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧠 Memory Training Games
          </h1>
          <p className="text-lg text-gray-600">
            Challenge your memory with card matching, sequences, and visual patterns!
          </p>
        </motion.div>

        {/* Game Mode Selector */}
        {!gameActive && (
          <motion.div 
            className="flex justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { mode: 'card-match' as GameMode, title: 'Card Match', icon: '🃏' },
              { mode: 'sequence' as GameMode, title: 'Sequence', icon: '🔢' },
              { mode: 'visual' as GameMode, title: 'Visual Pattern', icon: '👁️' }
            ].map(({ mode, title, icon }) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameMode(mode)}
                className={`px-6 py-4 rounded-xl transition-all duration-300 ${
                  gameMode === mode
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="font-semibold">{title}</div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Game Stats */}
        {gameActive && (
          <motion.div 
            className="flex justify-center items-center gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </motion.button>
          </motion.div>
        )}

        {/* Game Content */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {gameActive ? (
            <>
              {gameMode === 'card-match' && renderCardGame()}
              {gameMode === 'sequence' && renderSequenceGame()}
              {gameMode === 'visual' && renderVisualGame()}
            </>
          ) : (
            <div className="text-center py-12">
              <motion.div
                className="text-6xl mb-6"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
              >
                🧠
              </motion.div>
              
              {gameCompleted ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-green-600">🎉 Great Job!</h3>
                  <p className="text-gray-600">Final Score: {score}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-800">Ready to Train Your Memory?</h3>
                  <p className="text-gray-600">Choose a game mode above and click start!</p>
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startGame()}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🚀 Start Training
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 