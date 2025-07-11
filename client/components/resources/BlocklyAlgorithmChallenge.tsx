'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Clock,
  Target,
  Lightbulb,
  ArrowRight,
  Zap,
  BarChart3,
  Star
} from 'lucide-react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import 'blockly/blocks';

interface AlgorithmChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Sorting' | 'Searching' | 'Math' | 'Array' | 'String';
  problemStatement: string;
  inputDescription: string;
  outputDescription: string;
  testCases: {
    input: any;
    expectedOutput: any;
    description?: string;
  }[];
  hints: string[];
  solution: string;
  maxTime: number; // in seconds
  maxBlocks?: number;
  points: number;
}

const algorithmChallenges: AlgorithmChallenge[] = [
  {
    id: 'find-maximum',
    title: 'Find Maximum Number',
    description: 'Find the largest number in an array',
    difficulty: 'Easy',
    category: 'Array',
    problemStatement: 'Given an array of numbers, find and return the maximum value.',
    inputDescription: 'An array of numbers',
    outputDescription: 'The maximum number in the array',
    testCases: [
      { input: [3, 7, 2, 9, 1], expectedOutput: 9, description: 'Basic case' },
      { input: [-5, -2, -8, -1], expectedOutput: -1, description: 'All negative numbers' },
      { input: [42], expectedOutput: 42, description: 'Single element' },
      { input: [5, 5, 5, 5], expectedOutput: 5, description: 'All same numbers' }
    ],
    hints: [
      'Start by assuming the first number is the maximum',
      'Compare each number with the current maximum',
      'Update the maximum if you find a larger number',
      'Use a loop to go through all numbers'
    ],
    solution: 'Use a variable to track the maximum value as you iterate through the array',
    maxTime: 300,
    maxBlocks: 8,
    points: 100
  },
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    description: 'Reverse the characters in a string',
    difficulty: 'Easy',
    category: 'String',
    problemStatement: 'Given a string, return a new string with characters in reverse order.',
    inputDescription: 'A string of characters',
    outputDescription: 'The string with characters reversed',
    testCases: [
      { input: 'hello', expectedOutput: 'olleh', description: 'Basic string' },
      { input: 'algorithm', expectedOutput: 'mhtirogla', description: 'Longer string' },
      { input: 'a', expectedOutput: 'a', description: 'Single character' },
      { input: '', expectedOutput: '', description: 'Empty string' }
    ],
    hints: [
      'Start with an empty result string',
      'Go through each character in the original string',
      'Add each character to the beginning of the result',
      'Use string concatenation or a loop'
    ],
    solution: 'Build the reversed string by adding characters in reverse order',
    maxTime: 240,
    maxBlocks: 6,
    points: 80
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    description: 'Sort an array using the bubble sort algorithm',
    difficulty: 'Medium',
    category: 'Sorting',
    problemStatement: 'Implement bubble sort to arrange numbers in ascending order.',
    inputDescription: 'An unsorted array of numbers',
    outputDescription: 'The same array sorted in ascending order',
    testCases: [
      { input: [64, 34, 25, 12, 22, 11, 90], expectedOutput: [11, 12, 22, 25, 34, 64, 90], description: 'Random numbers' },
      { input: [5, 2, 8, 1, 9], expectedOutput: [1, 2, 5, 8, 9], description: 'Small array' },
      { input: [1, 2, 3, 4, 5], expectedOutput: [1, 2, 3, 4, 5], description: 'Already sorted' },
      { input: [5, 4, 3, 2, 1], expectedOutput: [1, 2, 3, 4, 5], description: 'Reverse sorted' }
    ],
    hints: [
      'Use nested loops to compare adjacent elements',
      'Swap elements if they are in the wrong order',
      'After each pass, the largest element "bubbles" to the end',
      'You need fewer comparisons in each subsequent pass'
    ],
    solution: 'Compare adjacent elements and swap if necessary, repeat until no swaps are made',
    maxTime: 600,
    maxBlocks: 15,
    points: 200
  },
  {
    id: 'fibonacci-sequence',
    title: 'Fibonacci Sequence',
    description: 'Generate the nth Fibonacci number',
    difficulty: 'Medium',
    category: 'Math',
    problemStatement: 'Calculate the nth number in the Fibonacci sequence.',
    inputDescription: 'A positive integer n',
    outputDescription: 'The nth Fibonacci number',
    testCases: [
      { input: 1, expectedOutput: 1, description: 'First Fibonacci number' },
      { input: 5, expectedOutput: 5, description: 'Fifth Fibonacci number' },
      { input: 10, expectedOutput: 55, description: 'Tenth Fibonacci number' },
      { input: 7, expectedOutput: 13, description: 'Seventh Fibonacci number' }
    ],
    hints: [
      'The Fibonacci sequence starts with 1, 1',
      'Each subsequent number is the sum of the two preceding numbers',
      'F(n) = F(n-1) + F(n-2)',
      'You can use iteration or recursion'
    ],
    solution: 'Use iteration to calculate each Fibonacci number step by step',
    maxTime: 480,
    maxBlocks: 12,
    points: 150
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'Find an element in a sorted array using binary search',
    difficulty: 'Hard',
    category: 'Searching',
    problemStatement: 'Implement binary search to find the index of a target value in a sorted array.',
    inputDescription: 'A sorted array and a target value',
    outputDescription: 'The index of the target value, or -1 if not found',
    testCases: [
      { input: { array: [1, 3, 5, 7, 9, 11, 13], target: 7 }, expectedOutput: 3, description: 'Target found' },
      { input: { array: [1, 3, 5, 7, 9, 11, 13], target: 4 }, expectedOutput: -1, description: 'Target not found' },
      { input: { array: [2, 4, 6, 8, 10], target: 2 }, expectedOutput: 0, description: 'Target at beginning' },
      { input: { array: [2, 4, 6, 8, 10], target: 10 }, expectedOutput: 4, description: 'Target at end' }
    ],
    hints: [
      'Start with left = 0 and right = array.length - 1',
      'Find the middle index and compare with target',
      'If target is smaller, search the left half',
      'If target is larger, search the right half',
      'Repeat until found or search space is empty'
    ],
    solution: 'Divide the search space in half at each step based on comparison with middle element',
    maxTime: 720,
    maxBlocks: 20,
    points: 300
  }
];

export default function BlocklyAlgorithmChallenge() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<AlgorithmChallenge>(algorithmChallenges[0]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; output: any; expected: any; description: string }[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [totalScore, setTotalScore] = useState(0);
  const [blockCount, setBlockCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime]);

  const initializeBlockly = () => {
    const toolboxXml = `
      <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
        <category name="Logic" colour="#5b67a5">
          <block type="controls_if"></block>
          <block type="controls_ifelse"></block>
          <block type="logic_compare">
            <field name="OP">EQ</field>
          </block>
          <block type="logic_operation">
            <field name="OP">AND</field>
          </block>
          <block type="logic_negate"></block>
          <block type="logic_boolean">
            <field name="BOOL">TRUE</field>
          </block>
        </category>
        <category name="Loops" colour="#5ba55b">
          <block type="controls_repeat_ext">
            <value name="TIMES">
              <shadow type="math_number">
                <field name="NUM">10</field>
              </shadow>
            </value>
          </block>
          <block type="controls_whileUntil">
            <field name="MODE">WHILE</field>
          </block>
          <block type="controls_for">
            <field name="VAR">i</field>
            <value name="FROM">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
            <value name="TO">
              <shadow type="math_number">
                <field name="NUM">10</field>
              </shadow>
            </value>
            <value name="BY">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
          </block>
          <block type="controls_forEach">
            <field name="VAR">item</field>
          </block>
        </category>
        <category name="Math" colour="#5ba58c">
          <block type="math_number">
            <field name="NUM">0</field>
          </block>
          <block type="math_arithmetic">
            <field name="OP">ADD</field>
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
          <block type="math_number_property">
            <field name="PROPERTY">EVEN</field>
          </block>
          <block type="math_round">
            <field name="OP">ROUND</field>
          </block>
          <block type="math_on_list">
            <field name="OP">SUM</field>
          </block>
        </category>
        <category name="Text" colour="#5ba5a5">
          <block type="text">
            <field name="TEXT"></field>
          </block>
          <block type="text_join"></block>
          <block type="text_append">
            <field name="VAR">item</field>
          </block>
          <block type="text_length"></block>
          <block type="text_isEmpty"></block>
          <block type="text_indexOf">
            <field name="END">FIRST</field>
          </block>
          <block type="text_charAt">
            <field name="WHERE">FROM_START</field>
          </block>
          <block type="text_getSubstring">
            <field name="WHERE1">FROM_START</field>
            <field name="WHERE2">FROM_START</field>
          </block>
        </category>
        <category name="Lists" colour="#745ba5">
          <block type="lists_create_empty"></block>
          <block type="lists_create_with">
            <mutation items="3"></mutation>
          </block>
          <block type="lists_repeat">
            <value name="NUM">
              <shadow type="math_number">
                <field name="NUM">5</field>
              </shadow>
            </value>
          </block>
          <block type="lists_length"></block>
          <block type="lists_isEmpty"></block>
          <block type="lists_indexOf">
            <field name="END">FIRST</field>
          </block>
          <block type="lists_getIndex">
            <field name="MODE">GET</field>
            <field name="WHERE">FROM_START</field>
          </block>
          <block type="lists_setIndex">
            <field name="MODE">SET</field>
            <field name="WHERE">FROM_START</field>
          </block>
          <block type="lists_getSublist">
            <field name="WHERE1">FROM_START</field>
            <field name="WHERE2">FROM_START</field>
          </block>
          <block type="lists_split">
            <field name="MODE">SPLIT</field>
          </block>
          <block type="lists_sort">
            <field name="TYPE">NUMERIC</field>
            <field name="DIRECTION">1</field>
          </block>
        </category>
        <category name="Variables" colour="#a55b80" custom="VARIABLE"></category>
        <category name="Functions" colour="#9a5ba5" custom="PROCEDURE"></category>
        <category name="Return" colour="#d4af37">
          <block type="procedures_defreturn">
            <field name="NAME">solve</field>
          </block>
          <block type="procedures_return">
            <value name="VALUE">
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
        colour: '#e0e0e0',
        snap: true
      },
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      theme: {
        'base': Blockly.Themes.Classic,
        'componentStyles': {
          'workspaceBackgroundColour': '#f8fafc',
          'toolboxBackgroundColour': '#ffffff',
          'toolboxForegroundColour': '#374151',
          'flyoutBackgroundColour': '#f3f4f6',
          'flyoutForegroundColour': '#374151',
          'flyoutOpacity': 0.8,
          'scrollbarColour': '#d1d5db',
          'insertionMarkerColour': '#3b82f6',
          'insertionMarkerOpacity': 0.3,
          'markerColour': '#3b82f6',
          'cursorColour': '#1f2937'
        }
      }
    });

    blocklyWorkspace.addChangeListener((event: any) => {
      if (event.type === Blockly.Events.BLOCK_CHANGE ||
          event.type === Blockly.Events.BLOCK_CREATE ||
          event.type === Blockly.Events.BLOCK_DELETE ||
          event.type === Blockly.Events.BLOCK_MOVE) {
        const generatedCode = javascriptGenerator.workspaceToCode(blocklyWorkspace);
        setCode(generatedCode);
        setBlockCount(blocklyWorkspace.getAllBlocks().length);
      }
    });

    setWorkspace(blocklyWorkspace);
  };

  const runTests = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    const results: { passed: boolean; output: any; expected: any; description: string }[] = [];
    
    try {
      for (const testCase of selectedChallenge.testCases) {
        try {
          // Create a safe execution environment
          const func = new Function('input', `
            ${code}
            
            // Try to call the solve function if it exists
            if (typeof solve === 'function') {
              return solve(input);
            }
            
            // If no solve function, try to execute the code directly
            return input;
          `);
          
          const output = func(testCase.input);
          const passed = JSON.stringify(output) === JSON.stringify(testCase.expectedOutput);
          
          results.push({
            passed,
            output,
            expected: testCase.expectedOutput,
            description: testCase.description || 'Test case'
          });
        } catch (error) {
          results.push({
            passed: false,
            output: `Error: ${error}`,
            expected: testCase.expectedOutput,
            description: testCase.description || 'Test case'
          });
        }
      }
      
      setTestResults(results);
      
      // Check if all tests passed
      const allPassed = results.every(result => result.passed);
      if (allPassed && !completedChallenges.includes(selectedChallenge.id)) {
        setCompletedChallenges(prev => [...prev, selectedChallenge.id]);
        setTotalScore(prev => prev + selectedChallenge.points);
        
        // Show success animation or notification
        setTimeout(() => {
          setShowSolution(true);
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const resetChallenge = () => {
    if (workspace) {
      workspace.clear();
    }
    setCode('');
    setTestResults([]);
    setShowHints(false);
    setCurrentHint(0);
    setShowSolution(false);
    setStartTime(Date.now());
    setTimeSpent(0);
    setBlockCount(0);
  };

  const selectChallenge = (challenge: AlgorithmChallenge) => {
    setSelectedChallenge(challenge);
    resetChallenge();
  };

  const showNextHint = () => {
    if (currentHint < selectedChallenge.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sorting': return 'text-blue-600 bg-blue-100';
      case 'Searching': return 'text-purple-600 bg-purple-100';
      case 'Math': return 'text-orange-600 bg-orange-100';
      case 'Array': return 'text-pink-600 bg-pink-100';
      case 'String': return 'text-cyan-600 bg-cyan-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPassedCount = () => testResults.filter(r => r.passed).length;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg">
            <Code2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Algorithm Challenge</h1>
            <p className="text-gray-600">Build algorithms using visual blocks</p>
          </div>
          <div className="ml-auto bg-white rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-gray-800">{totalScore}</span>
              <span className="text-gray-600">pts</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {algorithmChallenges.map((challenge) => (
            <button
              key={challenge.id}
              onClick={() => selectChallenge(challenge)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                selectedChallenge.id === challenge.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {challenge.title}
              {completedChallenges.includes(challenge.id) && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Challenge Info */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedChallenge.title}</h2>
                <p className="text-gray-600 mb-3">{selectedChallenge.description}</p>
              </div>
              {completedChallenges.includes(selectedChallenge.id) && (
                <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                  <Trophy className="h-5 w-5" />
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                {selectedChallenge.difficulty}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedChallenge.category)}`}>
                {selectedChallenge.category}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium text-yellow-600 bg-yellow-100">
                {selectedChallenge.points} pts
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Problem</h3>
              <p className="text-sm text-gray-600 mb-3">{selectedChallenge.problemStatement}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-700">Input:</span>
                  <p className="text-xs text-gray-600">{selectedChallenge.inputDescription}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-700">Output:</span>
                  <p className="text-xs text-gray-600">{selectedChallenge.outputDescription}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Test Cases</h3>
              <div className="space-y-2">
                {selectedChallenge.testCases.map((testCase, index) => (
                  <div key={index} className="text-xs bg-white p-2 rounded border">
                    <div className="font-medium text-gray-700">{testCase.description}</div>
                    <div className="text-gray-600">
                      Input: {JSON.stringify(testCase.input)}
                    </div>
                    <div className="text-gray-600">
                      Expected: {JSON.stringify(testCase.expectedOutput)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Time Spent</span>
                <span className="text-sm font-medium text-gray-800 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTime(timeSpent)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Blocks Used</span>
                <span className="text-sm font-medium text-gray-800">{blockCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tests Passed</span>
                <span className="text-sm font-medium text-green-600">
                  {getPassedCount()} / {selectedChallenge.testCases.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Score</span>
                <span className="text-sm font-medium text-yellow-600">{totalScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Blockly Workspace */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <span className="font-semibold">Algorithm Builder</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={runTests}
                    disabled={!code.trim() || isRunning}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isRunning ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Run Tests
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetChallenge}
                    className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
            
            <div ref={blocklyDiv} className="h-96 bg-gray-50" />
            
            {/* Test Results */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Test Results:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {getPassedCount()} / {selectedChallenge.testCases.length} passed
                  </span>
                  {testResults.length > 0 && getPassedCount() === selectedChallenge.testCases.length && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">All tests passed!</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.passed
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {result.passed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">{result.description}</span>
                    </div>
                    <div className="text-xs">
                      <div>Output: {JSON.stringify(result.output)}</div>
                      <div>Expected: {JSON.stringify(result.expected)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Hints and Actions */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Hints
                </h3>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  {showHints ? 'Hide' : 'Show'} Hints
                </button>
              </div>
              
              <AnimatePresence>
                {showHints && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2"
                  >
                    {selectedChallenge.hints.slice(0, currentHint + 1).map((hint, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-yellow-50 text-yellow-800 p-2 rounded-lg text-sm"
                      >
                        💡 {hint}
                      </motion.div>
                    ))}
                    {currentHint < selectedChallenge.hints.length - 1 && (
                      <button
                        onClick={showNextHint}
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Next Hint
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  View Solution
                </button>
                <button
                  onClick={() => {
                    const nextIndex = (algorithmChallenges.findIndex(c => c.id === selectedChallenge.id) + 1) % algorithmChallenges.length;
                    selectChallenge(algorithmChallenges[nextIndex]);
                  }}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Next Challenge
                </button>
              </div>
            </div>
          </div>
          
          {/* Solution */}
          <AnimatePresence>
            {showSolution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Solution Approach
                </h3>
                <p className="text-gray-600">{selectedChallenge.solution}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 