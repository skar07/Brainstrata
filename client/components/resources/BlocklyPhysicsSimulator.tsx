'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Target, 
  Lightbulb, 
  Award,
  ArrowRight,
  Atom,
  Waves,
  Thermometer,
  Magnet,
  Gauge
} from 'lucide-react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import 'blockly/blocks';

interface PhysicsObject {
  id: string;
  type: 'ball' | 'box' | 'spring' | 'pendulum' | 'projectile';
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius?: number;
  width?: number;
  height?: number;
  color: string;
  properties: { [key: string]: any };
}

interface PhysicsExperiment {
  id: string;
  title: string;
  description: string;
  category: 'Mechanics' | 'Waves' | 'Thermodynamics' | 'Electromagnetism' | 'Optics';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  scenario: string;
  initialObjects: PhysicsObject[];
  parameters: {
    gravity: number;
    friction: number;
    airResistance: number;
    timeStep: number;
    bounds: { width: number; height: number };
  };
  objectives: string[];
  hints: string[];
  expectedBehavior: string;
}

const physicsExperiments: PhysicsExperiment[] = [
  {
    id: 'falling-ball',
    title: 'Falling Ball',
    description: 'Simulate a ball falling under gravity',
    category: 'Mechanics',
    difficulty: 'Beginner',
    scenario: 'Create a simulation of a ball falling from a height. Observe how gravity affects its motion.',
    initialObjects: [
      {
        id: 'ball1',
        type: 'ball',
        x: 200,
        y: 50,
        vx: 0,
        vy: 0,
        mass: 1,
        radius: 20,
        color: '#3b82f6',
        properties: {}
      }
    ],
    parameters: {
      gravity: 9.8,
      friction: 0.1,
      airResistance: 0.01,
      timeStep: 0.016,
      bounds: { width: 400, height: 300 }
    },
    objectives: [
      'Create a falling ball simulation',
      'Apply gravity to the ball',
      'Make the ball bounce when it hits the ground'
    ],
    hints: [
      'Use the gravity block to apply downward acceleration',
      'Update the ball position based on velocity',
      'Check for collision with the ground and reverse velocity'
    ],
    expectedBehavior: 'The ball should fall downward and bounce when it hits the ground'
  },
  {
    id: 'projectile-motion',
    title: 'Projectile Motion',
    description: 'Simulate projectile motion with initial velocity',
    category: 'Mechanics',
    difficulty: 'Intermediate',
    scenario: 'Launch a projectile with initial velocity and observe its parabolic path.',
    initialObjects: [
      {
        id: 'projectile',
        type: 'projectile',
        x: 50,
        y: 250,
        vx: 15,
        vy: -10,
        mass: 0.5,
        radius: 15,
        color: '#ef4444',
        properties: { trail: [] }
      }
    ],
    parameters: {
      gravity: 9.8,
      friction: 0.02,
      airResistance: 0.005,
      timeStep: 0.016,
      bounds: { width: 400, height: 300 }
    },
    objectives: [
      'Set initial velocity for the projectile',
      'Apply gravity to create parabolic motion',
      'Track the projectile\'s trajectory'
    ],
    hints: [
      'Set both horizontal and vertical initial velocities',
      'Gravity only affects vertical motion',
      'Store previous positions to draw the trail'
    ],
    expectedBehavior: 'The projectile should follow a parabolic path and leave a trail'
  },
  {
    id: 'pendulum',
    title: 'Simple Pendulum',
    description: 'Create a swinging pendulum simulation',
    category: 'Mechanics',
    difficulty: 'Intermediate',
    scenario: 'Build a pendulum that swings back and forth under gravity.',
    initialObjects: [
      {
        id: 'pendulum',
        type: 'pendulum',
        x: 200,
        y: 150,
        vx: 0,
        vy: 0,
        mass: 1,
        radius: 15,
        color: '#8b5cf6',
        properties: {
          angle: Math.PI / 4,
          length: 100,
          pivotX: 200,
          pivotY: 50
        }
      }
    ],
    parameters: {
      gravity: 9.8,
      friction: 0.001,
      airResistance: 0.001,
      timeStep: 0.016,
      bounds: { width: 400, height: 300 }
    },
    objectives: [
      'Create a pendulum with a fixed pivot point',
      'Apply gravitational force to the pendulum bob',
      'Maintain constant string length'
    ],
    hints: [
      'Use trigonometry to calculate the pendulum position',
      'Apply tangential gravitational force',
      'Update the angle based on angular velocity'
    ],
    expectedBehavior: 'The pendulum should swing back and forth in a smooth arc'
  },
  {
    id: 'wave-simulation',
    title: 'Wave Propagation',
    description: 'Simulate wave motion and interference',
    category: 'Waves',
    difficulty: 'Advanced',
    scenario: 'Create a wave simulation showing propagation and interference patterns.',
    initialObjects: [
      {
        id: 'wave1',
        type: 'wave',
        x: 100,
        y: 150,
        vx: 0,
        vy: 0,
        mass: 1,
        radius: 10,
        color: '#10b981',
        properties: {
          frequency: 2,
          amplitude: 30,
          wavelength: 50,
          phase: 0
        }
      }
    ],
    parameters: {
      gravity: 0,
      friction: 0,
      airResistance: 0,
      timeStep: 0.016,
      bounds: { width: 400, height: 300 }
    },
    objectives: [
      'Create a wave source',
      'Generate propagating waves',
      'Show wave interference patterns'
    ],
    hints: [
      'Use sine function to generate wave patterns',
      'Propagate waves outward from the source',
      'Combine wave amplitudes for interference'
    ],
    expectedBehavior: 'Waves should propagate outward and create interference patterns'
  },
  {
    id: 'collision-simulation',
    title: 'Elastic Collision',
    description: 'Simulate elastic collisions between objects',
    category: 'Mechanics',
    difficulty: 'Advanced',
    scenario: 'Create a simulation of elastic collisions between multiple objects.',
    initialObjects: [
      {
        id: 'ball1',
        type: 'ball',
        x: 100,
        y: 150,
        vx: 5,
        vy: 0,
        mass: 1,
        radius: 20,
        color: '#f59e0b',
        properties: {}
      },
      {
        id: 'ball2',
        type: 'ball',
        x: 300,
        y: 150,
        vx: -3,
        vy: 0,
        mass: 1.5,
        radius: 25,
        color: '#06b6d4',
        properties: {}
      }
    ],
    parameters: {
      gravity: 0,
      friction: 0,
      airResistance: 0,
      timeStep: 0.016,
      bounds: { width: 400, height: 300 }
    },
    objectives: [
      'Detect collisions between objects',
      'Apply conservation of momentum',
      'Maintain conservation of energy'
    ],
    hints: [
      'Check distance between objects for collision',
      'Calculate new velocities using conservation laws',
      'Separate overlapping objects after collision'
    ],
    expectedBehavior: 'Objects should collide and exchange momentum realistically'
  }
];

export default function BlocklyPhysicsSimulator() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [selectedExperiment, setSelectedExperiment] = useState<PhysicsExperiment>(physicsExperiments[0]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [code, setCode] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationObjects, setSimulationObjects] = useState<PhysicsObject[]>([]);
  const [time, setTime] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [completedExperiments, setCompletedExperiments] = useState<string[]>([]);
  const [showParameters, setShowParameters] = useState(false);
  const [parameters, setParameters] = useState(physicsExperiments[0].parameters);

  useEffect(() => {
    if (blocklyDiv.current && typeof window !== 'undefined') {
      initializeBlockly();
    }

    return () => {
      if (workspace) {
        workspace.dispose();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setSimulationObjects([...selectedExperiment.initialObjects]);
    setParameters(selectedExperiment.parameters);
    setTime(0);
  }, [selectedExperiment]);

  const initializeBlockly = () => {
    const toolboxXml = `
      <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
        <category name="Physics Forces" colour="#e74c3c">
          <block type="physics_gravity">
            <field name="GRAVITY">9.8</field>
          </block>
          <block type="physics_friction">
            <field name="FRICTION">0.1</field>
          </block>
          <block type="physics_spring_force">
            <field name="K">10</field>
          </block>
          <block type="physics_magnetic_force">
            <field name="STRENGTH">5</field>
          </block>
          <block type="physics_electric_force">
            <field name="CHARGE">1</field>
          </block>
        </category>
        <category name="Motion" colour="#3498db">
          <block type="physics_set_velocity">
            <field name="VX">0</field>
            <field name="VY">0</field>
          </block>
          <block type="physics_set_acceleration">
            <field name="AX">0</field>
            <field name="AY">0</field>
          </block>
          <block type="physics_update_position"></block>
          <block type="physics_bounce"></block>
        </category>
        <category name="Collision" colour="#9b59b6">
          <block type="physics_check_collision"></block>
          <block type="physics_elastic_collision"></block>
          <block type="physics_inelastic_collision"></block>
        </category>
        <category name="Waves" colour="#1abc9c">
          <block type="physics_sine_wave">
            <field name="AMPLITUDE">10</field>
            <field name="FREQUENCY">1</field>
          </block>
          <block type="physics_wave_propagation"></block>
          <block type="physics_interference"></block>
        </category>
        <category name="Objects" colour="#f39c12">
          <block type="physics_create_object">
            <field name="TYPE">ball</field>
            <field name="MASS">1</field>
          </block>
          <block type="physics_get_object">
            <field name="OBJECT_ID">ball1</field>
          </block>
          <block type="physics_set_property">
            <field name="PROPERTY">x</field>
            <field name="VALUE">100</field>
          </block>
          <block type="physics_get_property">
            <field name="PROPERTY">x</field>
          </block>
        </category>
        <category name="Math" colour="#95a5a6">
          <block type="math_number">
            <field name="NUM">0</field>
          </block>
          <block type="math_arithmetic">
            <field name="OP">ADD</field>
          </block>
          <block type="math_single">
            <field name="OP">SIN</field>
          </block>
          <block type="math_trig">
            <field name="OP">SIN</field>
          </block>
          <block type="math_constant">
            <field name="CONSTANT">PI</field>
          </block>
        </category>
        <category name="Logic" colour="#34495e">
          <block type="controls_if"></block>
          <block type="logic_compare">
            <field name="OP">GT</field>
          </block>
          <block type="logic_operation">
            <field name="OP">AND</field>
          </block>
          <block type="logic_boolean">
            <field name="BOOL">TRUE</field>
          </block>
        </category>
        <category name="Loops" colour="#27ae60">
          <block type="controls_repeat_ext">
            <value name="TIMES">
              <shadow type="math_number">
                <field name="NUM">10</field>
              </shadow>
            </value>
          </block>
          <block type="controls_forEach">
            <field name="VAR">object</field>
          </block>
        </category>
        <category name="Variables" colour="#e67e22" custom="VARIABLE"></category>
        <category name="Functions" colour="#8e44ad" custom="PROCEDURE"></category>
      </xml>
    `;

    // Define custom physics blocks
    definePhysicsBlocks();

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
          'insertionMarkerColour': '#10b981',
          'insertionMarkerOpacity': 0.3,
          'markerColour': '#10b981',
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
      }
    });

    setWorkspace(blocklyWorkspace);
  };

  const definePhysicsBlocks = () => {
    // Define custom physics blocks
    Blockly.Blocks['physics_gravity'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('apply gravity')
          .appendField(new Blockly.FieldNumber(9.8, 0, 20, 0.1), 'GRAVITY')
          .appendField('to object')
          .appendField(new Blockly.FieldVariable('object'), 'OBJECT');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('Apply gravitational force to an object');
      }
    };

    Blockly.Blocks['physics_set_velocity'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('set velocity of')
          .appendField(new Blockly.FieldVariable('object'), 'OBJECT')
          .appendField('vx:')
          .appendField(new Blockly.FieldNumber(0, -100, 100, 0.1), 'VX')
          .appendField('vy:')
          .appendField(new Blockly.FieldNumber(0, -100, 100, 0.1), 'VY');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(60);
        this.setTooltip('Set the velocity of an object');
      }
    };

    Blockly.Blocks['physics_update_position'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('update position of')
          .appendField(new Blockly.FieldVariable('object'), 'OBJECT');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(60);
        this.setTooltip('Update object position based on velocity');
      }
    };

    Blockly.Blocks['physics_bounce'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('bounce')
          .appendField(new Blockly.FieldVariable('object'), 'OBJECT')
          .appendField('off boundaries');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(60);
        this.setTooltip('Make object bounce off boundaries');
      }
    };

    // Add JavaScript generators for custom blocks
    javascriptGenerator['physics_gravity'] = function(block: any) {
      const gravity = block.getFieldValue('GRAVITY');
      const object = javascriptGenerator.variableDB_.getName(block.getFieldValue('OBJECT'), Blockly.Variables.NAME_TYPE);
      const code = `${object}.vy += ${gravity} * timeStep;\n`;
      return code;
    };

    javascriptGenerator['physics_set_velocity'] = function(block: any) {
      const object = javascriptGenerator.variableDB_.getName(block.getFieldValue('OBJECT'), Blockly.Variables.NAME_TYPE);
      const vx = block.getFieldValue('VX');
      const vy = block.getFieldValue('VY');
      const code = `${object}.vx = ${vx};\n${object}.vy = ${vy};\n`;
      return code;
    };

    javascriptGenerator['physics_update_position'] = function(block: any) {
      const object = javascriptGenerator.variableDB_.getName(block.getFieldValue('OBJECT'), Blockly.Variables.NAME_TYPE);
      const code = `${object}.x += ${object}.vx * timeStep;\n${object}.y += ${object}.vy * timeStep;\n`;
      return code;
    };

    javascriptGenerator['physics_bounce'] = function(block: any) {
      const object = javascriptGenerator.variableDB_.getName(block.getFieldValue('OBJECT'), Blockly.Variables.NAME_TYPE);
      const code = `
        if (${object}.x <= ${object}.radius || ${object}.x >= bounds.width - ${object}.radius) {
          ${object}.vx *= -0.8;
          ${object}.x = Math.max(${object}.radius, Math.min(bounds.width - ${object}.radius, ${object}.x));
        }
        if (${object}.y <= ${object}.radius || ${object}.y >= bounds.height - ${object}.radius) {
          ${object}.vy *= -0.8;
          ${object}.y = Math.max(${object}.radius, Math.min(bounds.height - ${object}.radius, ${object}.y));
        }
      `;
      return code;
    };
  };

  const startSimulation = () => {
    if (!code.trim()) return;
    
    setIsSimulating(true);
    setSimulationObjects([...selectedExperiment.initialObjects]);
    setTime(0);
    animate();
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setSimulationObjects([...selectedExperiment.initialObjects]);
    setTime(0);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const animate = useCallback(() => {
    if (!isSimulating) return;
    
    setTime(prev => prev + parameters.timeStep);
    
    // Execute physics simulation code
    try {
      const simulationContext = {
        objects: simulationObjects,
        timeStep: parameters.timeStep,
        gravity: parameters.gravity,
        bounds: parameters.bounds
      };
      
      // Create a safe execution environment
      const func = new Function('objects', 'timeStep', 'gravity', 'bounds', code);
      func(simulationObjects, parameters.timeStep, parameters.gravity, parameters.bounds);
    } catch (error) {
      console.error('Simulation error:', error);
    }
    
    // Update canvas
    drawSimulation();
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isSimulating, code, simulationObjects, parameters]);

  const drawSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    
    // Draw boundaries
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Draw objects
    simulationObjects.forEach(obj => {
      ctx.save();
      
      switch (obj.type) {
        case 'ball':
        case 'projectile':
          ctx.fillStyle = obj.color;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, obj.radius || 10, 0, 2 * Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Draw trail for projectile
          if (obj.type === 'projectile' && obj.properties.trail) {
            ctx.strokeStyle = obj.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            obj.properties.trail.forEach((point: any, index: number) => {
              if (index === 0) {
                ctx.moveTo(point.x, point.y);
              } else {
                ctx.lineTo(point.x, point.y);
              }
            });
            ctx.stroke();
            
            // Add current position to trail
            obj.properties.trail.push({ x: obj.x, y: obj.y });
            if (obj.properties.trail.length > 50) {
              obj.properties.trail.shift();
            }
          }
          break;
          
        case 'pendulum':
          const props = obj.properties;
          // Draw string
          ctx.strokeStyle = '#374151';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(props.pivotX, props.pivotY);
          ctx.lineTo(obj.x, obj.y);
          ctx.stroke();
          
          // Draw pivot
          ctx.fillStyle = '#374151';
          ctx.beginPath();
          ctx.arc(props.pivotX, props.pivotY, 5, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw bob
          ctx.fillStyle = obj.color;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, obj.radius || 10, 0, 2 * Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.stroke();
          break;
          
        case 'box':
          ctx.fillStyle = obj.color;
          ctx.fillRect(obj.x - (obj.width || 20) / 2, obj.y - (obj.height || 20) / 2, obj.width || 20, obj.height || 20);
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.strokeRect(obj.x - (obj.width || 20) / 2, obj.y - (obj.height || 20) / 2, obj.width || 20, obj.height || 20);
          break;
      }
      
      ctx.restore();
    });
    
    // Draw time display
    ctx.fillStyle = '#374151';
    ctx.font = '14px monospace';
    ctx.fillText(`Time: ${time.toFixed(2)}s`, 10, 20);
  };

  const selectExperiment = (experiment: PhysicsExperiment) => {
    setSelectedExperiment(experiment);
    resetSimulation();
  };

  const showNextHint = () => {
    if (currentHint < selectedExperiment.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Mechanics': return 'text-blue-600 bg-blue-100';
      case 'Waves': return 'text-green-600 bg-green-100';
      case 'Thermodynamics': return 'text-red-600 bg-red-100';
      case 'Electromagnetism': return 'text-purple-600 bg-purple-100';
      case 'Optics': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mechanics': return <Target className="h-4 w-4" />;
      case 'Waves': return <Waves className="h-4 w-4" />;
      case 'Thermodynamics': return <Thermometer className="h-4 w-4" />;
      case 'Electromagnetism': return <Magnet className="h-4 w-4" />;
      case 'Optics': return <Zap className="h-4 w-4" />;
      default: return <Atom className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-emerald-50 to-blue-100 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-3 rounded-lg">
            <Atom className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Physics Simulator</h1>
            <p className="text-gray-600">Build interactive physics experiments with visual blocks</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {physicsExperiments.map((experiment) => (
            <button
              key={experiment.id}
              onClick={() => selectExperiment(experiment)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                selectedExperiment.id === experiment.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {getCategoryIcon(experiment.category)}
              {experiment.title}
              {completedExperiments.includes(experiment.id) && (
                <Award className="h-4 w-4 text-yellow-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Experiment Info */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedExperiment.title}</h2>
                <p className="text-gray-600 mb-3">{selectedExperiment.description}</p>
              </div>
              {completedExperiments.includes(selectedExperiment.id) && (
                <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                  <Award className="h-5 w-5" />
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedExperiment.difficulty)}`}>
                {selectedExperiment.difficulty}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedExperiment.category)}`}>
                {selectedExperiment.category}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Scenario</h3>
              <p className="text-sm text-gray-600">{selectedExperiment.scenario}</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Objectives</h3>
              <ul className="space-y-1">
                {selectedExperiment.objectives.map((objective, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Parameters */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Parameters
              </h3>
              <button
                onClick={() => setShowParameters(!showParameters)}
                className="text-sm text-emerald-600 hover:text-emerald-800"
              >
                {showParameters ? 'Hide' : 'Show'}
              </button>
            </div>
            
            <AnimatePresence>
              {showParameters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Gravity</span>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.1"
                      value={parameters.gravity}
                      onChange={(e) => setParameters(prev => ({ ...prev, gravity: parseFloat(e.target.value) }))}
                      className="w-20"
                    />
                    <span className="text-sm font-medium text-gray-800">{parameters.gravity.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Friction</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={parameters.friction}
                      onChange={(e) => setParameters(prev => ({ ...prev, friction: parseFloat(e.target.value) }))}
                      className="w-20"
                    />
                    <span className="text-sm font-medium text-gray-800">{parameters.friction.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Time Step</span>
                    <input
                      type="range"
                      min="0.001"
                      max="0.1"
                      step="0.001"
                      value={parameters.timeStep}
                      onChange={(e) => setParameters(prev => ({ ...prev, timeStep: parseFloat(e.target.value) }))}
                      className="w-20"
                    />
                    <span className="text-sm font-medium text-gray-800">{parameters.timeStep.toFixed(3)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Blockly Editor */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">Physics Block Editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={isSimulating ? stopSimulation : startSimulation}
                    className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    {isSimulating ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Simulate
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
            
            <div ref={blocklyDiv} className="h-96 bg-gray-50" />
          </div>
          
          {/* Hints */}
          <div className="mt-4 bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Hints
              </h3>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-sm text-emerald-600 hover:text-emerald-800"
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
                  {selectedExperiment.hints.slice(0, currentHint + 1).map((hint, index) => (
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
                  {currentHint < selectedExperiment.hints.length - 1 && (
                    <button
                      onClick={showNextHint}
                      className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Next Hint
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Simulation Canvas */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-800 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  <span className="font-semibold">Physics Simulation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>Time: {time.toFixed(2)}s</span>
                  {isSimulating && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
            
            <canvas
              ref={canvasRef}
              width={parameters.bounds.width}
              height={parameters.bounds.height}
              className="border-0 block"
              style={{ backgroundColor: '#f8fafc' }}
            />
            
            <div className="p-4 bg-gray-50 border-t">
              <div className="text-sm text-gray-600">
                <p className="mb-2">Expected Behavior:</p>
                <p className="text-gray-800 italic">{selectedExperiment.expectedBehavior}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 