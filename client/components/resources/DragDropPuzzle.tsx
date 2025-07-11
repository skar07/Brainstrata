'use client';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, Target, Award } from 'lucide-react';

interface PuzzleItem {
  id: string;
  content: string;
  category?: string;
  correctPosition?: number;
  image?: string;
}

interface PuzzleConfig {
  id: string;
  title: string;
  description: string;
  type: 'sorting' | 'matching' | 'sequence' | 'categorization';
  items: PuzzleItem[];
  solution: string[] | { [key: string]: string[] };
  hints?: string[];
}

const samplePuzzles: PuzzleConfig[] = [
  {
    id: 'sorting-numbers',
    title: 'Sort Numbers',
    description: 'Arrange these numbers in ascending order',
    type: 'sorting',
    items: [
      { id: 'num-1', content: '15', correctPosition: 3 },
      { id: 'num-2', content: '3', correctPosition: 1 },
      { id: 'num-3', content: '8', correctPosition: 2 },
      { id: 'num-4', content: '22', correctPosition: 4 },
      { id: 'num-5', content: '1', correctPosition: 0 }
    ],
    solution: ['1', '3', '8', '15', '22'],
    hints: ['Start with the smallest number', 'Think about counting order']
  },
  {
    id: 'categorization-animals',
    title: 'Categorize Animals',
    description: 'Sort these animals into their correct habitats',
    type: 'categorization',
    items: [
      { id: 'animal-1', content: '🐟 Fish', category: 'water' },
      { id: 'animal-2', content: '🐅 Tiger', category: 'land' },
      { id: 'animal-3', content: '🐋 Whale', category: 'water' },
      { id: 'animal-4', content: '🦅 Eagle', category: 'air' },
      { id: 'animal-5', content: '🐘 Elephant', category: 'land' },
      { id: 'animal-6', content: '🦆 Duck', category: 'water' }
    ],
    solution: {
      land: ['🐅 Tiger', '🐘 Elephant'],
      water: ['🐟 Fish', '🐋 Whale', '🦆 Duck'],
      air: ['🦅 Eagle']
    },
    hints: ['Think about where each animal lives', 'Some animals can live in multiple places']
  }
];

interface DragDropPuzzleProps {
  puzzle?: PuzzleConfig;
  onComplete?: (success: boolean, time: number) => void;
}

export default function DragDropPuzzle({ puzzle, onComplete }: DragDropPuzzleProps) {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleConfig>(puzzle || samplePuzzles[0]);
  const [userSolution, setUserSolution] = useState<{ [key: string]: PuzzleItem[] }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [currentHint, setCurrentHint] = useState(0);

  // Initialize user solution based on puzzle type
  useEffect(() => {
    if (currentPuzzle.type === 'categorization') {
      const categories = Object.keys(currentPuzzle.solution as { [key: string]: string[] });
      const initialSolution: { [key: string]: PuzzleItem[] } = {};
      categories.forEach(category => {
        initialSolution[category] = [];
      });
      initialSolution['items'] = [...currentPuzzle.items];
      setUserSolution(initialSolution);
    } else {
      setUserSolution({
        items: [...currentPuzzle.items],
        solution: []
      });
    }
    setIsCompleted(false);
    setShowHints(false);
    setCurrentHint(0);
    setStartTime(Date.now());
  }, [currentPuzzle]);

  const goToNextPuzzle = () => {
    const nextIndex = (currentPuzzleIndex + 1) % samplePuzzles.length;
    setCurrentPuzzleIndex(nextIndex);
    setCurrentPuzzle(samplePuzzles[nextIndex]);
  };

  const goToPreviousPuzzle = () => {
    const prevIndex = currentPuzzleIndex === 0 ? samplePuzzles.length - 1 : currentPuzzleIndex - 1;
    setCurrentPuzzleIndex(prevIndex);
    setCurrentPuzzle(samplePuzzles[prevIndex]);
  };

  const goToPuzzle = (index: number) => {
    setCurrentPuzzleIndex(index);
    setCurrentPuzzle(samplePuzzles[index]);
  };

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    setUserSolution(prevSolution => {
      const newSolution = { ...prevSolution };

      // Remove item from source
      const sourceItems = [...newSolution[source.droppableId]];
      const [removed] = sourceItems.splice(source.index, 1);

      // Add item to destination  
      const destItems = [...newSolution[destination.droppableId]];
      destItems.splice(destination.index, 0, removed);

      newSolution[source.droppableId] = sourceItems;
      newSolution[destination.droppableId] = destItems;

      return newSolution;
    });
  }, []);

  useEffect(() => {
    checkSolution(userSolution);
  }, [userSolution]);

  const checkSolution = useCallback((solution: { [key: string]: PuzzleItem[] }) => {
    let isCorrect = false;

    if (currentPuzzle.type === 'sorting') {
      const userOrder = solution.solution?.map(item => item.content) || [];
      isCorrect = JSON.stringify(userOrder) === JSON.stringify(currentPuzzle.solution);
    } else if (currentPuzzle.type === 'categorization') {
      const expectedSolution = currentPuzzle.solution as { [key: string]: string[] };
      isCorrect = Object.keys(expectedSolution).every(category => {
        const userItems = solution[category]?.map(item => item.content) || [];
        const expectedItems = expectedSolution[category];
        return userItems.length === expectedItems.length &&
               userItems.every(item => expectedItems.includes(item));
      });
    }

    if (isCorrect && !isCompleted) {
      setIsCompleted(true);
      const completionTime = Date.now() - startTime;
      onComplete?.(true, completionTime);
    }
  }, [currentPuzzle, isCompleted, startTime, onComplete]);

  const resetPuzzle = () => {
    setIsCompleted(false);
    setShowHints(false);
    setCurrentHint(0);
    
    if (currentPuzzle.type === 'categorization') {
      const categories = Object.keys(currentPuzzle.solution as { [key: string]: string[] });
      const initialSolution: { [key: string]: PuzzleItem[] } = {};
      categories.forEach(category => {
        initialSolution[category] = [];
      });
      initialSolution['items'] = [...currentPuzzle.items];
      setUserSolution(initialSolution);
    } else {
      setUserSolution({
        items: [...currentPuzzle.items],
        solution: []
      });
    }
  };

  const showNextHint = () => {
    if (currentPuzzle.hints && currentHint < currentPuzzle.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentPuzzle.title}</h2>
              <p className="text-sm text-gray-500">Puzzle {currentPuzzleIndex + 1} of {samplePuzzles.length}</p>
            </div>
          </div>
          
          {/* Puzzle Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPuzzle}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Previous Puzzle"
            >
              ← Previous
            </button>
            
            <select
              value={currentPuzzleIndex}
              onChange={(e) => goToPuzzle(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {samplePuzzles.map((puzzleOption, index) => (
                <option key={index} value={index}>
                  {puzzleOption.title}
                </option>
              ))}
            </select>
            
            <button
              onClick={goToNextPuzzle}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              title="Next Puzzle"
            >
              Next →
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{currentPuzzle.description}</p>
        
        {/* Controls */}
        <div className="flex gap-4">
          <button
            onClick={resetPuzzle}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          >
            💡 {showHints ? 'Hide' : 'Show'} Hints
          </button>
        </div>
      </div>

      {/* Hints */}
      <AnimatePresence>
        {showHints && currentPuzzle.hints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h3 className="font-semibold text-blue-800 mb-2">💡 Hint {currentHint + 1}:</h3>
            <p className="text-blue-700">{currentPuzzle.hints[currentHint]}</p>
            {currentHint < currentPuzzle.hints.length - 1 && (
              <button
                onClick={showNextHint}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Show next hint
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="h-8 w-8 text-green-600" />
              <h3 className="text-xl font-semibold text-green-800">Congratulations!</h3>
            </div>
            <p className="text-green-700 mb-6">You solved the puzzle correctly! 🎉</p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetPuzzle}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
              
              {currentPuzzleIndex < samplePuzzles.length - 1 && (
                <button
                  onClick={goToNextPuzzle}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Next Puzzle →
                </button>
              )}
              
              {currentPuzzleIndex === samplePuzzles.length - 1 && (
                <button
                  onClick={() => goToPuzzle(0)}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  🎯 Start Over
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puzzle Area */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          {/* Available Items */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Available Items</h3>
            <Droppable droppableId="items" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[80px] flex flex-wrap gap-2 p-2 rounded-lg border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  {userSolution.items?.map((item, index) => (
                    <Draggable 
                      key={`items-${item.id}-${index}`} 
                      draggableId={item.id} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-4 py-2 bg-white rounded-lg shadow-sm border cursor-move transition-all ${
                            snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                          }`}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Solution Areas */}
          {currentPuzzle.type === 'sorting' && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Solution (Correct Order)</h3>
              <Droppable droppableId="solution" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[80px] flex flex-wrap gap-2 p-2 rounded-lg border-2 border-dashed transition-colors ${
                      snapshot.isDraggingOver ? 'border-green-400 bg-green-100' : 'border-green-300'
                    }`}
                  >
                    {userSolution.solution?.map((item, index) => (
                      <Draggable 
                        key={`solution-${item.id}-${index}`} 
                        draggableId={item.id} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`px-4 py-2 bg-white rounded-lg shadow-sm border cursor-move transition-all ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                            }`}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )}

          {currentPuzzle.type === 'categorization' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(currentPuzzle.solution as { [key: string]: string[] }).map(category => (
                <div key={category} className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 capitalize">{category}</h3>
                  <Droppable droppableId={category}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[120px] space-y-2 p-2 rounded-lg border-2 border-dashed transition-colors ${
                          snapshot.isDraggingOver ? 'border-purple-400 bg-purple-100' : 'border-purple-300'
                        }`}
                      >
                        {userSolution[category]?.map((item, index) => (
                          <Draggable 
                            key={`${category}-${item.id}-${index}`} 
                            draggableId={item.id} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`px-3 py-2 bg-white rounded-lg shadow-sm border cursor-move transition-all ${
                                  snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                                }`}
                              >
                                {item.content}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          )}
        </div>
      </DragDropContext>
    </div>
  );
} 