'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Settings } from 'lucide-react';

interface Gate {
  id: string;
  type: 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR';
  x: number;
  y: number;
  inputs: (boolean | null)[];
  output: boolean | null;
}

interface Connection {
  id: string;
  from: { gateId: string; outputIndex: number };
  to: { gateId: string; inputIndex: number };
}

interface CircuitChallenge {
  id: string;
  title: string;
  description: string;
  targetOutput: boolean[];
  inputs: boolean[];
  requiredGates: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const challenges: CircuitChallenge[] = [
  {
    id: 'basic-and',
    title: 'Basic AND Gate',
    description: 'Create a circuit that outputs TRUE only when both inputs are TRUE',
    targetOutput: [false, false, false, true],
    inputs: [false, false, true, true], // Input combinations: 00, 01, 10, 11
    requiredGates: ['AND'],
    difficulty: 'easy'
  },
  {
    id: 'basic-or',
    title: 'Basic OR Gate',
    description: 'Create a circuit that outputs TRUE when at least one input is TRUE',
    targetOutput: [false, true, true, true],
    inputs: [false, false, true, true],
    requiredGates: ['OR'],
    difficulty: 'easy'
  },
  {
    id: 'not-gate',
    title: 'NOT Gate Logic',
    description: 'Create a circuit that inverts the input',
    targetOutput: [true, false],
    inputs: [false, true],
    requiredGates: ['NOT'],
    difficulty: 'easy'
  },
  {
    id: 'compound-logic',
    title: 'Compound Logic',
    description: 'Create (A AND B) OR (NOT C)',
    targetOutput: [true, false, true, true],
    inputs: [false, false, true, true],
    requiredGates: ['AND', 'OR', 'NOT'],
    difficulty: 'medium'
  }
];

const gateTemplates = {
  AND: { inputs: 2, symbol: '&', color: 'bg-blue-500' },
  OR: { inputs: 2, symbol: '≥1', color: 'bg-green-500' },
  NOT: { inputs: 1, symbol: '¬', color: 'bg-red-500' },
  XOR: { inputs: 2, symbol: '⊕', color: 'bg-purple-500' },
  NAND: { inputs: 2, symbol: '⊼', color: 'bg-orange-500' },
  NOR: { inputs: 2, symbol: '⊽', color: 'bg-pink-500' }
};

export default function DigitalCircuitLab() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [gates, setGates] = useState<Gate[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [inputValues, setInputValues] = useState<boolean[]>([false, false]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const challenge = challenges[currentChallenge];

  useEffect(() => {
    resetCircuit();
  }, [currentChallenge]);

  const resetCircuit = () => {
    setGates([]);
    setConnections([]);
    setInputValues([false, false]);
    setResults([]);
    setIsCorrect(false);
    setShowSuccess(false);
  };

  const addGate = (type: keyof typeof gateTemplates) => {
    const newGate: Gate = {
      id: `gate-${Date.now()}`,
      type,
      x: Math.random() * 300 + 100,
      y: Math.random() * 200 + 100,
      inputs: new Array(gateTemplates[type].inputs).fill(null),
      output: null
    };
    setGates(prev => [...prev, newGate]);
  };

  const calculateGateOutput = (gate: Gate): boolean | null => {
    const { type, inputs } = gate;
    
    if (inputs.some(input => input === null)) return null;

    switch (type) {
      case 'AND':
        return inputs.every(input => input === true);
      case 'OR':
        return inputs.some(input => input === true);
      case 'NOT':
        return !inputs[0];
      case 'XOR':
        return inputs[0] !== inputs[1];
      case 'NAND':
        return !inputs.every(input => input === true);
      case 'NOR':
        return !inputs.some(input => input === true);
      default:
        return null;
    }
  };

  const simulateCircuit = () => {
    setIsSimulating(true);
    const testResults: boolean[] = [];
    
    // Test all input combinations for the challenge
    const inputCombinations = [];
    for (let i = 0; i < challenge.inputs.length; i += 2) {
      inputCombinations.push([challenge.inputs[i], challenge.inputs[i + 1]]);
    }

    inputCombinations.forEach(inputCombo => {
      // Set inputs and propagate through circuit
      const updatedGates = [...gates];
      
      // Update gate outputs based on current inputs
      updatedGates.forEach(gate => {
        gate.output = calculateGateOutput(gate);
      });

      // For now, assume the last gate is the output
      const outputGate = updatedGates[updatedGates.length - 1];
      testResults.push(outputGate?.output || false);
    });

    setResults(testResults);
    
    // Check if results match target
    const correct = JSON.stringify(testResults) === JSON.stringify(challenge.targetOutput);
    setIsCorrect(correct);
    
    if (correct) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    
    setTimeout(() => setIsSimulating(false), 1000);
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
    } else {
      setCurrentChallenge(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ⚡ Digital Circuit Lab
          </h1>
          <p className="text-gray-600 text-lg">
            Build logic circuits and test your Boolean algebra skills!
          </p>
        </motion.div>

        {/* Challenge Card */}
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{challenge.title}</h2>
              <p className="text-gray-600">{challenge.description}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {challenge.difficulty}
              </span>
              <div className="text-sm text-gray-500 mt-1">
                Challenge {currentChallenge + 1}/{challenges.length}
              </div>
            </div>
          </div>

          {/* Truth Table */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Expected Truth Table:</h3>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div className="font-semibold">Input A</div>
              <div className="font-semibold">Input B</div>
              <div className="font-semibold">Expected</div>
              <div className="font-semibold">Your Result</div>
              
              {challenge.targetOutput.map((expected, index) => (
                <React.Fragment key={index}>
                  <div className="p-2 bg-blue-100 rounded">
                    {challenge.inputs[index * 2] ? '1' : '0'}
                  </div>
                  <div className="p-2 bg-blue-100 rounded">
                    {challenge.inputs[index * 2 + 1] ? '1' : '0'}
                  </div>
                  <div className="p-2 bg-green-100 rounded">
                    {expected ? '1' : '0'}
                  </div>
                  <div className={`p-2 rounded ${
                    results[index] !== undefined 
                      ? (results[index] === expected ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800')
                      : 'bg-gray-100'
                  }`}>
                    {results[index] !== undefined ? (results[index] ? '1' : '0') : '?'}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Gate Palette */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Logic Gates</h3>
              <div className="space-y-3">
                {Object.entries(gateTemplates).map(([type, template]) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addGate(type as keyof typeof gateTemplates)}
                    className={`w-full p-3 ${template.color} text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{type}</span>
                      <span className="text-lg">{template.symbol}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={simulateCircuit}
                  disabled={gates.length === 0 || isSimulating}
                  className="w-full p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isSimulating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Settings className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    {isSimulating ? 'Testing...' : 'Test Circuit'}
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetCircuit}
                  className="w-full p-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </div>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Circuit Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[500px]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Circuit Designer</h3>
              
              <div className="relative bg-gray-50 rounded-xl min-h-[400px] p-6 border-2 border-dashed border-gray-300">
                {gates.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Drag logic gates here to build your circuit</p>
                      <p className="text-sm mt-2">Start by adding gates from the palette</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {gates.map((gate, index) => (
                      <motion.div
                        key={gate.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`absolute ${gateTemplates[gate.type].color} text-white rounded-lg p-4 cursor-move shadow-lg`}
                        style={{ left: gate.x, top: gate.y }}
                        drag
                        dragMomentum={false}
                        onDrag={(_, info) => {
                          setGates(prev => prev.map(g => 
                            g.id === gate.id 
                              ? { ...g, x: gate.x + info.offset.x, y: gate.y + info.offset.y }
                              : g
                          ));
                        }}
                      >
                        <div className="text-center">
                          <div className="font-bold text-sm">{gate.type}</div>
                          <div className="text-2xl">{gateTemplates[gate.type].symbol}</div>
                          <div className="text-xs mt-1">
                            Output: {gate.output !== null ? (gate.output ? '1' : '0') : '?'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-6 rounded-2xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              {isCorrect ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <h3 className={`text-lg font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Perfect! Circuit works correctly!' : 'Circuit needs adjustment'}
              </h3>
            </div>
            
            {isCorrect && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextChallenge}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              >
                {currentChallenge < challenges.length - 1 ? 'Next Challenge' : 'Restart Course'}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </motion.button>
            )}
          </motion.div>
        )}

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
                  ⚡
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Circuit Complete!
                </h3>
                <p className="text-gray-600">
                  Your logic circuit produces the correct output!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 