'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, RotateCcw, Lightbulb, CheckCircle, X, Plus, Minus, Divide, Equal, Play } from 'lucide-react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import 'blockly/blocks';

interface MathProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'arithmetic' | 'algebra' | 'geometry' | 'statistics';
  problem: string;
  solution: number;
  steps: string[];
}

const mathProblems: MathProblem[] = [
  {
    id: '1',
    title: 'Basic Addition',
    description: 'Solve simple addition problems',
    difficulty: 'Easy',
    type: 'arithmetic',
    problem: '15 + 23 = ?',
    solution: 38,
    steps: ['Add the ones: 5 + 3 = 8', 'Add the tens: 1 + 2 = 3', 'Result: 38']
  },
  {
    id: '2',
    title: 'Linear Equation',
    description: 'Solve for x in a linear equation',
    difficulty: 'Medium',
    type: 'algebra',
    problem: '2x + 5 = 13',
    solution: 4,
    steps: ['Subtract 5 from both sides: 2x = 8', 'Divide by 2: x = 4']
  },
  {
    id: '3',
    title: 'Area of Circle',
    description: 'Calculate the area of a circle',
    difficulty: 'Medium',
    type: 'geometry',
    problem: 'Find area of circle with radius 5',
    solution: 78.54,
    steps: ['Use formula: A = πr²', 'A = π × 5²', 'A = π × 25 ≈ 78.54']
  },
  {
    id: '4',
    title: 'Mean Calculation',
    description: 'Find the average of a set of numbers',
    difficulty: 'Easy',
    type: 'statistics',
    problem: 'Find mean of: 4, 8, 6, 10, 12',
    solution: 8,
    steps: ['Sum all numbers: 4+8+6+10+12 = 40', 'Divide by count: 40÷5 = 8']
  }
];

export default function BlocklyMathSolver() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const [selectedProblem, setSelectedProblem] = useState<MathProblem>(mathProblems[0]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [code, setCode] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    if (blocklyDiv.current && typeof window !== 'undefined') {
      initializeBlockly();
    }

    return () => {
      if (workspace) {
        workspace.dispose();
      }
    };
  }, []);

  const initializeBlockly = () => {
    const toolboxXml = `
      <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
        <category name="Math" colour="#5b67a5">
          <block type="math_number">
            <field name="NUM">15</field>
          </block>
          <block type="math_number">
            <field name="NUM">23</field>
          </block>
          <block type="math_number">
            <field name="NUM">5</field>
          </block>
          <block type="math_arithmetic">
            <field name="OP">ADD</field>
            <value name="A">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
            <value name="B">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
          </block>
          <block type="math_arithmetic">
            <field name="OP">MINUS</field>
          </block>
          <block type="math_arithmetic">
            <field name="OP">MULTIPLY</field>
          </block>
          <block type="math_arithmetic">
            <field name="OP">DIVIDE</field>
          </block>
          <block type="math_single">
            <field name="OP">ROOT</field>
          </block>
          <block type="math_trig">
            <field name="OP">SIN</field>
          </block>
          <block type="math_constant">
            <field name="CONSTANT">PI</field>
          </block>
          <block type="math_round">
            <field name="OP">ROUND</field>
          </block>
        </category>
        <category name="Variables" colour="#a55b80" custom="VARIABLE"></category>
        <category name="Output" colour="#5ba55b">
          <block type="text_print">
            <value name="TEXT">
              <shadow type="math_number">
                <field name="NUM">0</field>
              </shadow>
            </value>
          </block>
        </category>
      </xml>
    `;

    const blocklyWorkspace = Blockly.inject(blocklyDiv.current!, {
      toolbox: toolboxXml,
      grid: {
        spacing: 25,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    });

    blocklyWorkspace.addChangeListener(() => {
      const generatedCode = javascriptGenerator.workspaceToCode(blocklyWorkspace);
      setCode(generatedCode);
    });

    setWorkspace(blocklyWorkspace);
  };

  const clearWorkspace = () => {
    if (workspace) {
      workspace.clear();
    }
    setCode('');
    setUserAnswer('');
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (!code) return;
    
    try {
      // Capture console.log output
      let capturedOutput = '';
      const originalLog = console.log;
      console.log = (...args) => {
        capturedOutput += args.join(' ');
      };
      
      // Execute the generated code
      new Function(code)();
      console.log = originalLog;
      
      const result = parseFloat(capturedOutput);
      setUserAnswer(result.toString());
      
      const isAnswerCorrect = Math.abs(result - selectedProblem.solution) < 0.01;
      setIsCorrect(isAnswerCorrect);
    } catch (error) {
      setIsCorrect(false);
      setUserAnswer('Error in calculation');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Visual Math Problem Solver
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Build mathematical expressions using draggable blocks. 
          Learn step-by-step problem solving with visual tools!
        </p>
      </motion.div>

      {/* Problem Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mathProblems.map((problem, index) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
              setSelectedProblem(problem);
              clearWorkspace();
            }}
            className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedProblem.id === problem.id ? 'border-2 border-blue-500' : 'border-2 border-transparent'
            }`}
          >
            <div className={`text-xs px-2 py-1 rounded-full mb-2 w-fit ${
              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {problem.difficulty}
            </div>
            <div className={`text-xs px-2 py-1 rounded-full mb-2 w-fit ${
              problem.type === 'arithmetic' ? 'bg-blue-100 text-blue-600' :
              problem.type === 'algebra' ? 'bg-purple-100 text-purple-600' :
              problem.type === 'geometry' ? 'bg-green-100 text-green-600' :
              'bg-orange-100 text-orange-600'
            }`}>
              {problem.type}
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{problem.title}</h3>
            <p className="text-sm text-gray-600">{problem.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problem Statement */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">{selectedProblem.title}</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
            <p className="text-lg font-mono text-center">{selectedProblem.problem}</p>
          </div>
          <p className="text-gray-600 mb-4">{selectedProblem.description}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg"
              >
                <p className="text-sm text-yellow-700">
                  💡 Drag math blocks from the toolbox to build your calculation and use print block to show the result.
                </p>
              </motion.div>
            )}

            <button
              onClick={() => setShowSteps(!showSteps)}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              {showSteps ? 'Hide Steps' : 'Show Solution Steps'}
            </button>

            {showSteps && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-green-50 border border-green-200 p-3 rounded-lg"
              >
                <div className="space-y-2">
                  {selectedProblem.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">{index + 1}.</span>
                      <span className="text-sm text-green-700">{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Blockly Workspace */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Math Block Editor</h3>
              <div className="flex gap-2">
                <button
                  onClick={clearWorkspace}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Clear workspace"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={checkAnswer}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="h-4 w-4" />
                  Check Answer
                </button>
              </div>
            </div>
          </div>
          
          <div 
            ref={blocklyDiv}
            className="h-96 bg-gray-50"
          />
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Generated Code */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Generated Code</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[100px] overflow-auto">
              {code || '// Your math expression will appear here'}
            </div>
          </div>

          {/* Answer Display */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Result</h3>
            <div className={`p-4 rounded-lg text-center ${
              isCorrect === true ? 'bg-green-50 border border-green-200' :
              isCorrect === false ? 'bg-red-50 border border-red-200' :
              'bg-gray-50'
            }`}>
              {isCorrect === true && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center gap-2 text-green-600 mb-2"
                >
                  <CheckCircle className="h-6 w-6" />
                  <span className="font-bold">Correct!</span>
                </motion.div>
              )}
              {isCorrect === false && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center gap-2 text-red-600 mb-2"
                >
                  <X className="h-6 w-6" />
                  <span className="font-bold">Try Again!</span>
                </motion.div>
              )}
              <p className="text-lg font-mono">
                {userAnswer || 'Build your expression and check the answer'}
              </p>
            </div>
          </div>

          {/* Math Concepts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Learning Focus</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Order of Operations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Basic Arithmetic</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Algebraic Thinking</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Problem Solving</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Problems Solved</span>
                <span className="font-bold">3/12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Accuracy: 85%</span>
                <span>Level 2</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 