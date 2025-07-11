'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Power, RotateCcw, CheckCircle, X, Lightbulb, Target, Star } from 'lucide-react';

interface LogicGate {
  id: string;
  type: 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR';
  x: number;
  y: number;
  inputs: boolean[];
  output: boolean;
}

interface Circuit {
  id: string;
  title: string;
  description: string;
  targetOutput: boolean[];
  inputs: boolean[];
  gates: LogicGate[];
  difficulty: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  circuit: string;
  inputs: { A: boolean; B: boolean; C?: boolean };
  expectedOutput: boolean;
  explanation: string;
}

const gateTypes = [
  { type: 'AND' as const, symbol: '&', description: 'Output is 1 only when ALL inputs are 1' },
  { type: 'OR' as const, symbol: '≥1', description: 'Output is 1 when ANY input is 1' },
  { type: 'NOT' as const, symbol: '¬', description: 'Output is opposite of input' },
  { type: 'NAND' as const, symbol: '&̄', description: 'Output is 0 only when ALL inputs are 1' },
  { type: 'NOR' as const, symbol: '≥1̄', description: 'Output is 0 when ANY input is 1' },
  { type: 'XOR' as const, symbol: '⊕', description: 'Output is 1 when inputs are different' }
];

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'AND Gate Logic',
    description: 'Test your understanding of AND gate behavior',
    circuit: 'A AND B',
    inputs: { A: true, B: false },
    expectedOutput: false,
    explanation: 'AND gate outputs 1 only when BOTH inputs are 1. Since B is 0, output is 0.'
  },
  {
    id: '2',
    title: 'OR Gate Logic',
    description: 'Test your understanding of OR gate behavior',
    circuit: 'A OR B',
    inputs: { A: false, B: true },
    expectedOutput: true,
    explanation: 'OR gate outputs 1 when ANY input is 1. Since B is 1, output is 1.'
  },
  {
    id: '3',
    title: 'NOT Gate Logic',
    description: 'Test your understanding of NOT gate behavior',
    circuit: 'NOT A',
    inputs: { A: true, B: false },
    expectedOutput: false,
    explanation: 'NOT gate inverts the input. Since A is 1, NOT A is 0.'
  },
  {
    id: '4',
    title: 'NAND Gate Logic',
    description: 'Test your understanding of NAND gate behavior',
    circuit: 'A NAND B',
    inputs: { A: true, B: true },
    expectedOutput: false,
    explanation: 'NAND gate is NOT AND. Since both inputs are 1, AND would be 1, so NAND is 0.'
  },
  {
    id: '5',
    title: 'XOR Gate Logic',
    description: 'Test your understanding of XOR gate behavior',
    circuit: 'A XOR B',
    inputs: { A: true, B: false },
    expectedOutput: true,
    explanation: 'XOR gate outputs 1 when inputs are different. A=1, B=0 are different, so output is 1.'
  },
  {
    id: '6',
    title: 'Complex Circuit',
    description: 'Analyze a more complex circuit',
    circuit: '(A AND B) OR (NOT C)',
    inputs: { A: false, B: true, C: true },
    expectedOutput: false,
    explanation: '(A AND B) = (0 AND 1) = 0. NOT C = NOT 1 = 0. (0 OR 0) = 0.'
  }
];

export default function DigitalCircuits() {
  const [currentMode, setCurrentMode] = useState<'learn' | 'challenge' | 'sandbox'>('learn');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [sandboxInputs, setSandboxInputs] = useState({ A: false, B: false, C: false });
  const [selectedGate, setSelectedGate] = useState<typeof gateTypes[0]>(gateTypes[0]);
  const [truthTableVisible, setTruthTableVisible] = useState(false);

  const challenge = challenges[currentChallenge];

  const calculateGateOutput = (gate: typeof gateTypes[0]['type'], inputs: boolean[]): boolean => {
    switch (gate) {
      case 'AND':
        return inputs.every(i => i);
      case 'OR':
        return inputs.some(i => i);
      case 'NOT':
        return !inputs[0];
      case 'NAND':
        return !inputs.every(i => i);
      case 'NOR':
        return !inputs.some(i => i);
      case 'XOR':
        return inputs.filter(i => i).length % 2 === 1;
      default:
        return false;
    }
  };

  const evaluateCircuit = (circuit: string, inputs: { A: boolean; B: boolean; C?: boolean }): boolean => {
    // Simple circuit evaluator for the challenges
    const { A, B, C } = inputs;
    
    switch (circuit) {
      case 'A AND B':
        return A && B;
      case 'A OR B':
        return A || B;
      case 'NOT A':
        return !A;
      case 'A NAND B':
        return !(A && B);
      case 'A XOR B':
        return A !== B;
      case '(A AND B) OR (NOT C)':
        return (A && B) || !C!;
      default:
        return false;
    }
  };

  const handleAnswerSelect = (answer: boolean) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === challenge.expectedOutput;
    
    if (isCorrect && !correctAnswers.includes(currentChallenge)) {
      setCorrectAnswers([...correctAnswers, currentChallenge]);
      setScore(score + 10);
    }
    
    setShowExplanation(true);
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetChallenge = () => {
    setCurrentChallenge(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCorrectAnswers([]);
    setScore(0);
  };

  const renderGate = (gate: typeof gateTypes[0], inputs: boolean[], size = 'md') => {
    const output = calculateGateOutput(gate.type, inputs);
    const sizeClasses = size === 'lg' ? 'w-32 h-20' : 'w-24 h-16';
    
    return (
      <motion.div
        className={`${sizeClasses} bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center relative shadow-lg`}
        whileHover={{ scale: 1.05 }}
      >
        {/* Input pins */}
        {inputs.map((input, index) => (
          <div
            key={index}
            className={`absolute left-0 w-3 h-3 rounded-full border-2 ${
              input ? 'bg-green-500 border-green-600' : 'bg-gray-300 border-gray-400'
            }`}
            style={{ top: `${30 + index * 30}%`, transform: 'translateX(-50%)' }}
          />
        ))}
        
        {/* Gate symbol */}
        <div className="text-lg font-bold text-gray-700">{gate.symbol}</div>
        
        {/* Output pin */}
        <div
          className={`absolute right-0 w-3 h-3 rounded-full border-2 ${
            output ? 'bg-green-500 border-green-600' : 'bg-gray-300 border-gray-400'
          }`}
          style={{ top: '50%', transform: 'translate(50%, -50%)' }}
        />
        
        {/* Gate type label */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600">
          {gate.type}
        </div>
      </motion.div>
    );
  };

  const renderTruthTable = (gate: typeof gateTypes[0]) => {
    const inputs = gate.type === 'NOT' ? [[true], [false]] : [
      [false, false],
      [false, true],
      [true, false],
      [true, true]
    ];

    return (
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-3 text-center">{gate.type} Truth Table</h3>
        <table className="w-full text-center">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="p-2">A</th>
              {gate.type !== 'NOT' && <th className="p-2">B</th>}
              <th className="p-2">Output</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((input, index) => {
              const output = calculateGateOutput(gate.type, input);
              return (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-2 font-mono">{input[0] ? '1' : '0'}</td>
                  {gate.type !== 'NOT' && <td className="p-2 font-mono">{input[1] ? '1' : '0'}</td>}
                  <td className={`p-2 font-mono font-bold ${output ? 'text-green-600' : 'text-red-600'}`}>
                    {output ? '1' : '0'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (currentMode === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              ⚡ Digital Logic Gates
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Learn how digital circuits work with interactive logic gates!
            </p>
            
            <div className="flex justify-center gap-4">
              {['learn', 'challenge', 'sandbox'].map((mode) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentMode(mode as any)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentMode === mode
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Logic Gates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gateTypes.map((gate, index) => (
              <motion.div
                key={gate.type}
                className="bg-white rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold text-center mb-4">{gate.type} Gate</h3>
                
                <div className="flex justify-center mb-6">
                  {renderGate(gate, gate.type === 'NOT' ? [true] : [true, false], 'lg')}
                </div>
                
                <p className="text-sm text-gray-600 text-center mb-4">{gate.description}</p>
                
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedGate(gate);
                      setTruthTableVisible(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Truth Table
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Truth Table Modal */}
          <AnimatePresence>
            {truthTableVisible && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setTruthTableVisible(false)}
              >
                <motion.div
                  className="max-w-md mx-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {renderTruthTable(selectedGate)}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentMode('challenge')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🚀 Start Challenge
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  if (currentMode === 'challenge') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Logic Gate Challenge</h1>
              <p className="text-gray-600">Question {currentChallenge + 1} of {challenges.length}</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-gray-800">{score}</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentMode('learn')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Learn
              </motion.button>
            </div>
          </motion.div>

          {/* Challenge Card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentChallenge}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">{challenge.title}</h2>
                <p className="text-purple-100">{challenge.description}</p>
              </div>

              <div className="p-8">
                {/* Circuit Visualization */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">Circuit: {challenge.circuit}</h3>
                  
                  <div className="flex justify-center items-center gap-8">
                    {/* Input Display */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-center">Inputs</h4>
                      {Object.entries(challenge.inputs).map(([key, value]) => (
                        key !== 'C' || value !== undefined ? (
                          <div key={key} className="flex items-center gap-3">
                            <span className="font-mono text-lg">{key}:</span>
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                              value ? 'bg-green-500 border-green-600 text-white' : 'bg-gray-300 border-gray-400 text-gray-600'
                            }`}>
                              {value ? '1' : '0'}
                            </div>
                          </div>
                        ) : null
                      ))}
                    </div>
                    
                    {/* Arrow */}
                    <div className="text-3xl text-gray-400">→</div>
                    
                    {/* Output */}
                    <div className="text-center">
                      <h4 className="font-semibold mb-3">Output</h4>
                      <div className="w-16 h-16 bg-gray-200 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center text-2xl text-gray-400">
                        ?
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answer Buttons */}
                {!showExplanation && (
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(true)}
                      className="p-6 border-2 border-green-300 rounded-xl hover:bg-green-50 transition-colors"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <div className="text-xl font-bold text-green-700">TRUE (1)</div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(false)}
                      className="p-6 border-2 border-red-300 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">❌</div>
                        <div className="text-xl font-bold text-red-700">FALSE (0)</div>
                      </div>
                    </motion.button>
                  </div>
                )}

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className={`p-6 rounded-xl border-2 mb-6 ${
                        selectedAnswer === challenge.expectedOutput
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                      }`}>
                        <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                          {selectedAnswer === challenge.expectedOutput ? (
                            <>
                              <CheckCircle className="h-6 w-6 text-green-600" />
                              <span className="text-green-800">Correct!</span>
                            </>
                          ) : (
                            <>
                              <X className="h-6 w-6 text-red-600" />
                              <span className="text-red-800">Incorrect</span>
                            </>
                          )}
                        </h3>
                        
                        <p className="text-gray-700 mb-4">{challenge.explanation}</p>
                        
                        <div className="text-center">
                          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-bold">
                            Correct Answer: {challenge.expectedOutput ? 'TRUE (1)' : 'FALSE (0)'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        {currentChallenge < challenges.length - 1 ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={nextChallenge}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Next Challenge →
                          </motion.button>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-2xl font-bold text-green-600">🎉 All Challenges Complete!</div>
                            <div className="text-lg">Final Score: {score}/{challenges.length * 10}</div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={resetChallenge}
                              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Try Again
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Sandbox mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧪 Logic Gate Sandbox
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Experiment with different logic gates and input combinations!
          </p>
          
          <div className="flex justify-center gap-4">
            {['learn', 'challenge', 'sandbox'].map((mode) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentMode(mode as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentMode === mode
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            {/* Input Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4">Input Controls</h3>
              <div className="space-y-4">
                {Object.entries(sandboxInputs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-semibold">Input {key}:</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSandboxInputs({
                        ...sandboxInputs,
                        [key]: !value
                      })}
                      className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                        value 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {value ? 'HIGH (1)' : 'LOW (0)'}
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gate Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4">Select Gate Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {gateTypes.map((gate) => (
                  <motion.button
                    key={gate.type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedGate(gate)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedGate.type === gate.type
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <div className="text-lg font-bold">{gate.type}</div>
                    <div className="text-2xl">{gate.symbol}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Gate Visualization */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-center">Gate Simulation</h3>
            
            <div className="flex justify-center mb-8">
              {renderGate(
                selectedGate,
                selectedGate.type === 'NOT' 
                  ? [sandboxInputs.A]
                  : [sandboxInputs.A, sandboxInputs.B],
                'lg'
              )}
            </div>

            <div className="text-center mb-6">
              <h4 className="font-semibold mb-2">Current Output:</h4>
              <div className={`inline-block w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold ${
                calculateGateOutput(
                  selectedGate.type,
                  selectedGate.type === 'NOT' 
                    ? [sandboxInputs.A]
                    : [sandboxInputs.A, sandboxInputs.B]
                )
                  ? 'bg-green-500 border-green-600 text-white'
                  : 'bg-gray-300 border-gray-400 text-gray-600'
              }`}>
                {calculateGateOutput(
                  selectedGate.type,
                  selectedGate.type === 'NOT' 
                    ? [sandboxInputs.A]
                    : [sandboxInputs.A, sandboxInputs.B]
                ) ? '1' : '0'}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">{selectedGate.description}</p>
              {renderTruthTable(selectedGate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 