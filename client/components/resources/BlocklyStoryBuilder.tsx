'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Save,
  FileText,
  Wand2,
  Heart,
  Zap,
  Star
} from 'lucide-react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import 'blockly/blocks';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  personality: string;
  background: string;
}

interface StoryScene {
  id: string;
  title: string;
  description: string;
  background: string;
  characters: string[];
  dialogue: { character: string; text: string }[];
  choices: { text: string; nextScene: string }[];
}

interface StoryTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Adventure' | 'Mystery' | 'Fantasy' | 'Sci-Fi' | 'Comedy';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  characters: Character[];
  startingScene: string;
  objectives: string[];
  hints: string[];
}

const storyTemplates: StoryTemplate[] = [
  {
    id: 'dragon-quest',
    title: 'Dragon Quest',
    description: 'Create an epic adventure story with dragons and heroes',
    category: 'Fantasy',
    difficulty: 'Beginner',
    characters: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'A brave adventurer',
        avatar: '🛡️',
        personality: 'Brave and determined',
        background: 'A young warrior seeking glory'
      },
      {
        id: 'dragon',
        name: 'Dragon',
        description: 'A mighty dragon',
        avatar: '🐉',
        personality: 'Fierce but wise',
        background: 'Ancient guardian of treasure'
      },
      {
        id: 'wizard',
        name: 'Wizard',
        description: 'A wise magic user',
        avatar: '🧙‍♂️',
        personality: 'Mysterious and helpful',
        background: 'Keeper of ancient knowledge'
      }
    ],
    startingScene: 'forest-entrance',
    objectives: [
      'Create dialogue between characters',
      'Add story choices for the reader',
      'Connect scenes with different paths',
      'Include character personality in dialogue'
    ],
    hints: [
      'Start with introducing the main character',
      'Use dialogue blocks to make characters speak',
      'Create choices that lead to different outcomes',
      'Build tension with descriptive scenes'
    ]
  },
  {
    id: 'space-mystery',
    title: 'Space Mystery',
    description: 'Solve a mystery aboard a space station',
    category: 'Sci-Fi',
    difficulty: 'Intermediate',
    characters: [
      {
        id: 'detective',
        name: 'Detective Nova',
        description: 'A skilled space detective',
        avatar: '🕵️‍♀️',
        personality: 'Analytical and persistent',
        background: 'Expert in space crimes'
      },
      {
        id: 'captain',
        name: 'Captain Rex',
        description: 'The station commander',
        avatar: '👨‍✈️',
        personality: 'Authoritative but worried',
        background: 'Veteran space officer'
      },
      {
        id: 'engineer',
        name: 'Engineer Zara',
        description: 'The station\'s chief engineer',
        avatar: '👩‍🔧',
        personality: 'Technical and nervous',
        background: 'Brilliant but anxious'
      },
      {
        id: 'ai',
        name: 'ARIA',
        description: 'The station AI',
        avatar: '🤖',
        personality: 'Logical and helpful',
        background: 'Advanced artificial intelligence'
      }
    ],
    startingScene: 'station-arrival',
    objectives: [
      'Create a mystery plot with clues',
      'Develop character relationships',
      'Build suspense through pacing',
      'Include multiple possible endings'
    ],
    hints: [
      'Start with discovering the mystery',
      'Use variables to track clues found',
      'Create logical deduction sequences',
      'Build towards a climactic revelation'
    ]
  },
  {
    id: 'magical-school',
    title: 'Magical School',
    description: 'Adventures at a school for young wizards',
    category: 'Fantasy',
    difficulty: 'Intermediate',
    characters: [
      {
        id: 'student',
        name: 'Alex',
        description: 'A new magic student',
        avatar: '🧙‍♂️',
        personality: 'Curious and eager',
        background: 'First-year magic student'
      },
      {
        id: 'professor',
        name: 'Professor Sage',
        description: 'A wise magic teacher',
        avatar: '👨‍🏫',
        personality: 'Wise and patient',
        background: 'Master of magical arts'
      },
      {
        id: 'rival',
        name: 'Morgan',
        description: 'A competitive classmate',
        avatar: '😏',
        personality: 'Competitive and proud',
        background: 'Top student from a magical family'
      },
      {
        id: 'creature',
        name: 'Spark',
        description: 'A magical companion',
        avatar: '✨',
        personality: 'Playful and loyal',
        background: 'A small magical creature'
      }
    ],
    startingScene: 'first-day',
    objectives: [
      'Create school-based adventures',
      'Develop friendships and rivalries',
      'Include magical elements in the story',
      'Build character growth arcs'
    ],
    hints: [
      'Start with the character\'s first day',
      'Use magic as both solution and problem',
      'Create conflicts between characters',
      'Show character learning and growth'
    ]
  }
];

export default function BlocklyStoryBuilder() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate>(storyTemplates[0]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [code, setCode] = useState('');
  const [currentStory, setCurrentStory] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [storyOutput, setStoryOutput] = useState<string[]>([]);
  const [currentScene, setCurrentScene] = useState<string>('');
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [savedStories, setSavedStories] = useState<any[]>([]);
  const [storyVariables, setStoryVariables] = useState<{ [key: string]: any }>({});
  const [characterMoods, setCharacterMoods] = useState<{ [key: string]: string }>({});

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
        <category name="Story Structure" colour="#e74c3c">
          <block type="story_start">
            <field name="TITLE">My Story</field>
            <field name="DESCRIPTION">An amazing adventure</field>
          </block>
          <block type="story_scene">
            <field name="SCENE_ID">scene1</field>
            <field name="TITLE">The Beginning</field>
            <field name="DESCRIPTION">Our story starts here...</field>
          </block>
          <block type="story_end">
            <field name="ENDING">A happy ending!</field>
          </block>
          <block type="story_choice">
            <field name="TEXT">What do you do?</field>
            <field name="NEXT_SCENE">scene2</field>
          </block>
        </category>
        <category name="Characters" colour="#3498db">
          <block type="character_speak">
            <field name="CHARACTER">Hero</field>
            <field name="DIALOGUE">Hello there!</field>
          </block>
          <block type="character_action">
            <field name="CHARACTER">Hero</field>
            <field name="ACTION">walks forward</field>
          </block>
          <block type="character_emotion">
            <field name="CHARACTER">Hero</field>
            <field name="EMOTION">happy</field>
          </block>
          <block type="character_meet">
            <field name="CHARACTER1">Hero</field>
            <field name="CHARACTER2">Dragon</field>
          </block>
        </category>
        <category name="Dialogue" colour="#9b59b6">
          <block type="dialogue_conversation">
            <field name="CHARACTERS">Hero, Dragon</field>
          </block>
          <block type="dialogue_question">
            <field name="CHARACTER">Hero</field>
            <field name="QUESTION">What is your name?</field>
          </block>
          <block type="dialogue_response">
            <field name="CHARACTER">Dragon</field>
            <field name="RESPONSE">I am the great dragon!</field>
          </block>
        </category>
        <category name="Narration" colour="#1abc9c">
          <block type="narrate_description">
            <field name="TEXT">The sun was setting over the mountains.</field>
          </block>
          <block type="narrate_action">
            <field name="TEXT">Suddenly, a loud roar echoed through the valley.</field>
          </block>
          <block type="narrate_mood">
            <field name="MOOD">mysterious</field>
            <field name="DESCRIPTION">The atmosphere grew tense.</field>
          </block>
        </category>
        <category name="Story Variables" colour="#f39c12">
          <block type="story_variable_set">
            <field name="VAR_NAME">health</field>
            <field name="VALUE">100</field>
          </block>
          <block type="story_variable_change">
            <field name="VAR_NAME">health</field>
            <field name="CHANGE">-10</field>
          </block>
          <block type="story_variable_check">
            <field name="VAR_NAME">health</field>
            <field name="OPERATOR">></field>
            <field name="VALUE">50</field>
          </block>
        </category>
        <category name="Conditions" colour="#95a5a6">
          <block type="story_if">
            <field name="CONDITION">health > 50</field>
          </block>
          <block type="story_random_choice">
            <field name="PROBABILITY">50</field>
          </block>
          <block type="story_character_present">
            <field name="CHARACTER">Hero</field>
          </block>
        </category>
        <category name="Logic" colour="#34495e">
          <block type="controls_if"></block>
          <block type="logic_compare">
            <field name="OP">EQ</field>
          </block>
          <block type="logic_operation">
            <field name="OP">AND</field>
          </block>
          <block type="logic_boolean">
            <field name="BOOL">TRUE</field>
          </block>
        </category>
        <category name="Variables" colour="#e67e22" custom="VARIABLE"></category>
        <category name="Functions" colour="#8e44ad" custom="PROCEDURE"></category>
      </xml>
    `;

    // Define custom story blocks
    defineStoryBlocks();

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
          'insertionMarkerColour': '#ec4899',
          'insertionMarkerOpacity': 0.3,
          'markerColour': '#ec4899',
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

  const defineStoryBlocks = () => {
    // Define custom story blocks
    Blockly.Blocks['story_start'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('start story')
          .appendField(new Blockly.FieldTextInput('My Story'), 'TITLE')
          .appendField('description')
          .appendField(new Blockly.FieldTextInput('An amazing adventure'), 'DESCRIPTION');
        this.setNextStatement(true, null);
        this.setColour(231);
        this.setTooltip('Begin a new story');
      }
    };

    Blockly.Blocks['character_speak'] = {
      init: function() {
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ['Hero', 'hero'],
            ['Dragon', 'dragon'],
            ['Wizard', 'wizard']
          ]), 'CHARACTER')
          .appendField('says')
          .appendField(new Blockly.FieldTextInput('Hello there!'), 'DIALOGUE');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(61);
        this.setTooltip('Make a character speak');
      }
    };

    Blockly.Blocks['narrate_description'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('narrate:')
          .appendField(new Blockly.FieldTextInput('The sun was setting over the mountains.'), 'TEXT');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(26);
        this.setTooltip('Add narrative description');
      }
    };

    Blockly.Blocks['story_choice'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('choice:')
          .appendField(new Blockly.FieldTextInput('What do you do?'), 'TEXT')
          .appendField('leads to scene')
          .appendField(new Blockly.FieldTextInput('scene2'), 'NEXT_SCENE');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(231);
        this.setTooltip('Add a story choice');
      }
    };

    // Add JavaScript generators for custom blocks
    javascriptGenerator['story_start'] = function(block: any) {
      const title = block.getFieldValue('TITLE');
      const description = block.getFieldValue('DESCRIPTION');
      const code = `addToStory('📚 **${title}**\\n${description}\\n\\n---\\n\\n');\n`;
      return code;
    };

    javascriptGenerator['character_speak'] = function(block: any) {
      const character = block.getFieldValue('CHARACTER');
      const dialogue = block.getFieldValue('DIALOGUE');
      const code = `addToStory('**${character}:** "${dialogue}"\\n\\n');\n`;
      return code;
    };

    javascriptGenerator['narrate_description'] = function(block: any) {
      const text = block.getFieldValue('TEXT');
      const code = `addToStory('${text}\\n\\n');\n`;
      return code;
    };

    javascriptGenerator['story_choice'] = function(block: any) {
      const text = block.getFieldValue('TEXT');
      const nextScene = block.getFieldValue('NEXT_SCENE');
      const code = `addToStory('🔸 **Choice:** ${text}\\n\\n');\n`;
      return code;
    };
  };

  const playStory = () => {
    if (!code.trim()) return;
    
    setIsPlaying(true);
    setStoryOutput([]);
    setStoryVariables({});
    
    try {
      const storyLines: string[] = [];
      
      // Create a safe execution environment
      const storyContext = {
        addToStory: (text: string) => {
          storyLines.push(text);
        },
        characters: selectedTemplate.characters,
        variables: storyVariables,
        currentScene: currentScene
      };
      
      // Execute the story code
      const func = new Function('addToStory', 'characters', 'variables', 'currentScene', code);
      func(storyContext.addToStory, storyContext.characters, storyContext.variables, storyContext.currentScene);
      
      // Animate story output
      let index = 0;
      const addLine = () => {
        if (index < storyLines.length) {
          setStoryOutput(prev => [...prev, storyLines[index]]);
          index++;
          setTimeout(addLine, 1000);
        } else {
          setIsPlaying(false);
        }
      };
      
      addLine();
      
    } catch (error) {
      console.error('Story execution error:', error);
      setStoryOutput(['Error: Could not execute story. Please check your blocks.']);
      setIsPlaying(false);
    }
  };

  const resetStory = () => {
    setIsPlaying(false);
    setStoryOutput([]);
    setCurrentScene('');
    setStoryVariables({});
  };

  const saveStory = () => {
    const story = {
      id: Date.now().toString(),
      title: `Story ${savedStories.length + 1}`,
      template: selectedTemplate.id,
      code: code,
      createdAt: new Date().toISOString(),
      output: storyOutput
    };
    
    setSavedStories(prev => [...prev, story]);
    
    // Show success message
    alert('Story saved successfully!');
  };

  const selectTemplate = (template: StoryTemplate) => {
    setSelectedTemplate(template);
    resetStory();
  };

  const showNextHint = () => {
    if (currentHint < selectedTemplate.hints.length - 1) {
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
      case 'Adventure': return 'text-blue-600 bg-blue-100';
      case 'Mystery': return 'text-purple-600 bg-purple-100';
      case 'Fantasy': return 'text-pink-600 bg-pink-100';
      case 'Sci-Fi': return 'text-cyan-600 bg-cyan-100';
      case 'Comedy': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Adventure': return '🏔️';
      case 'Mystery': return '🔍';
      case 'Fantasy': return '🏰';
      case 'Sci-Fi': return '🚀';
      case 'Comedy': return '😄';
      default: return '📖';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-pink-50 to-purple-100 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-lg">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Story Builder</h1>
            <p className="text-gray-600">Create interactive stories with visual blocks</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">Saved Stories:</span>
            <span className="bg-white text-purple-600 px-3 py-1 rounded-full font-semibold">
              {savedStories.length}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {storyTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => selectTemplate(template)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                selectedTemplate.id === template.id
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <span className="text-lg">{getCategoryIcon(template.category)}</span>
              {template.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Template Info */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(selectedTemplate.category)}</span>
                  {selectedTemplate.title}
                </h2>
                <p className="text-gray-600 mb-3">{selectedTemplate.description}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                {selectedTemplate.difficulty}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedTemplate.category)}`}>
                {selectedTemplate.category}
              </span>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Characters
              </h3>
              <div className="space-y-2">
                {selectedTemplate.characters.map((character) => (
                  <div key={character.id} className="flex items-center gap-2">
                    <span className="text-lg">{character.avatar}</span>
                    <div className="flex-1">
                      <div className="font-medium text-blue-700">{character.name}</div>
                      <div className="text-xs text-blue-600">{character.personality}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Objectives</h3>
              <ul className="space-y-1">
                {selectedTemplate.objectives.map((objective, index) => (
                  <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Hints */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Writing Tips
              </h3>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                {showHints ? 'Hide' : 'Show'} Tips
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
                  {selectedTemplate.hints.slice(0, currentHint + 1).map((hint, index) => (
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
                  {currentHint < selectedTemplate.hints.length - 1 && (
                    <button
                      onClick={showNextHint}
                      className="text-sm text-pink-600 hover:text-pink-800 flex items-center gap-1"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Next Tip
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Blockly Editor */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  <span className="font-semibold">Story Block Editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={playStory}
                    disabled={!code.trim() || isPlaying}
                    className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                        Playing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Play Story
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetStory}
                    className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
            
            <div ref={blocklyDiv} className="h-96 bg-gray-50" />
            
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Story Actions</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveStory}
                    disabled={!code.trim() || storyOutput.length === 0}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Output */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-semibold">Story Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  {isPlaying && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm">Playing...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 bg-gradient-to-br from-purple-50 to-pink-50">
              {storyOutput.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Your story will appear here</p>
                    <p className="text-sm">Click "Play Story" to see your creation come to life!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {storyOutput.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="prose prose-sm max-w-none">
                        {line.split('\\n').map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-2 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Story length: {storyOutput.length} scenes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Keep creating!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 