'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  Download,
  Mic,
  Headphones,
  Settings,
  Sparkles,
  ArrowRight,
  Heart,
  Star,
  Waves
} from 'lucide-react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import 'blockly/blocks';

interface Note {
  pitch: string;
  duration: number;
  octave: number;
  volume: number;
}

interface MusicPattern {
  id: string;
  name: string;
  notes: Note[];
  tempo: number;
  timeSignature: string;
  key: string;
}

interface MusicTemplate {
  id: string;
  title: string;
  description: string;
  genre: 'Classical' | 'Pop' | 'Jazz' | 'Electronic' | 'World';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tempo: number;
  timeSignature: string;
  key: string;
  pattern: MusicPattern;
  objectives: string[];
  hints: string[];
}

const musicTemplates: MusicTemplate[] = [
  {
    id: 'simple-melody',
    title: 'Simple Melody',
    description: 'Create a basic melody with simple notes',
    genre: 'Classical',
    difficulty: 'Beginner',
    tempo: 120,
    timeSignature: '4/4',
    key: 'C Major',
    pattern: {
      id: 'basic',
      name: 'Basic Pattern',
      notes: [
        { pitch: 'C', duration: 1, octave: 4, volume: 0.7 },
        { pitch: 'D', duration: 1, octave: 4, volume: 0.7 },
        { pitch: 'E', duration: 1, octave: 4, volume: 0.7 },
        { pitch: 'F', duration: 1, octave: 4, volume: 0.7 }
      ],
      tempo: 120,
      timeSignature: '4/4',
      key: 'C Major'
    },
    objectives: [
      'Create a sequence of notes',
      'Use different note durations',
      'Experiment with different pitches',
      'Build a simple melody'
    ],
    hints: [
      'Start with the C major scale: C-D-E-F-G-A-B-C',
      'Use quarter notes (duration 1) for steady rhythm',
      'Try different octaves for higher or lower sounds',
      'Connect notes smoothly for a flowing melody'
    ]
  },
  {
    id: 'rhythm-pattern',
    title: 'Rhythm Pattern',
    description: 'Create rhythmic patterns with percussion',
    genre: 'Electronic',
    difficulty: 'Intermediate',
    tempo: 128,
    timeSignature: '4/4',
    key: 'C Major',
    pattern: {
      id: 'rhythm',
      name: 'Drum Pattern',
      notes: [
        { pitch: 'kick', duration: 1, octave: 0, volume: 0.8 },
        { pitch: 'snare', duration: 1, octave: 0, volume: 0.6 },
        { pitch: 'hihat', duration: 0.5, octave: 0, volume: 0.4 },
        { pitch: 'kick', duration: 1, octave: 0, volume: 0.8 }
      ],
      tempo: 128,
      timeSignature: '4/4',
      key: 'C Major'
    },
    objectives: [
      'Create drum patterns',
      'Use different percussion sounds',
      'Experiment with rhythm timing',
      'Build a complete beat'
    ],
    hints: [
      'Start with kick drum on beats 1 and 3',
      'Add snare on beats 2 and 4',
      'Use hi-hats for continuous rhythm',
      'Try different volumes for dynamics'
    ]
  },
  {
    id: 'chord-progression',
    title: 'Chord Progression',
    description: 'Build chord progressions and harmonies',
    genre: 'Pop',
    difficulty: 'Advanced',
    tempo: 100,
    timeSignature: '4/4',
    key: 'C Major',
    pattern: {
      id: 'chords',
      name: 'Chord Pattern',
      notes: [
        { pitch: 'C', duration: 4, octave: 4, volume: 0.6 },
        { pitch: 'Am', duration: 4, octave: 4, volume: 0.6 },
        { pitch: 'F', duration: 4, octave: 4, volume: 0.6 },
        { pitch: 'G', duration: 4, octave: 4, volume: 0.6 }
      ],
      tempo: 100,
      timeSignature: '4/4',
      key: 'C Major'
    },
    objectives: [
      'Create chord progressions',
      'Use different chord types',
      'Build harmonic sequences',
      'Experiment with chord inversions'
    ],
    hints: [
      'Start with the I-vi-IV-V progression (C-Am-F-G)',
      'Use longer durations for chords (4 beats)',
      'Try different chord inversions',
      'Add bass notes for fuller sound'
    ]
  },
  {
    id: 'jazz-improvisation',
    title: 'Jazz Improvisation',
    description: 'Create jazz-style improvisations',
    genre: 'Jazz',
    difficulty: 'Advanced',
    tempo: 140,
    timeSignature: '4/4',
    key: 'Bb Major',
    pattern: {
      id: 'jazz',
      name: 'Jazz Pattern',
      notes: [
        { pitch: 'Bb', duration: 0.5, octave: 4, volume: 0.7 },
        { pitch: 'C', duration: 0.5, octave: 5, volume: 0.6 },
        { pitch: 'D', duration: 1, octave: 5, volume: 0.8 },
        { pitch: 'F', duration: 0.5, octave: 4, volume: 0.5 }
      ],
      tempo: 140,
      timeSignature: '4/4',
      key: 'Bb Major'
    },
    objectives: [
      'Create jazz-style melodies',
      'Use syncopated rhythms',
      'Experiment with blue notes',
      'Build improvisational phrases'
    ],
    hints: [
      'Use the blues scale for jazzy sounds',
      'Try syncopated rhythms (off-beat notes)',
      'Use shorter note durations for faster passages',
      'Add swing feel to your rhythm'
    ]
  }
];

export default function BlocklyMusicComposer() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MusicTemplate>(musicTemplates[0]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [code, setCode] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [composition, setComposition] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<number>(-1);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [tempo, setTempo] = useState(120);
  const [savedCompositions, setSavedCompositions] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);

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
        <category name="Notes" colour="#e74c3c">
          <block type="music_note">
            <field name="PITCH">C</field>
            <field name="DURATION">1</field>
            <field name="OCTAVE">4</field>
          </block>
          <block type="music_chord">
            <field name="CHORD">C</field>
            <field name="DURATION">4</field>
            <field name="OCTAVE">4</field>
          </block>
          <block type="music_rest">
            <field name="DURATION">1</field>
          </block>
        </category>
        <category name="Rhythm" colour="#3498db">
          <block type="music_drum">
            <field name="DRUM">kick</field>
            <field name="DURATION">1</field>
          </block>
          <block type="music_pattern">
            <field name="PATTERN">basic</field>
            <field name="REPEATS">4</field>
          </block>
          <block type="music_syncopation">
            <field name="OFFSET">0.5</field>
          </block>
        </category>
        <category name="Melody" colour="#9b59b6">
          <block type="music_scale">
            <field name="SCALE">major</field>
            <field name="KEY">C</field>
          </block>
          <block type="music_arpeggio">
            <field name="CHORD">C</field>
            <field name="DIRECTION">up</field>
          </block>
          <block type="music_sequence">
            <field name="LENGTH">8</field>
          </block>
        </category>
        <category name="Harmony" colour="#1abc9c">
          <block type="music_chord_progression">
            <field name="PROGRESSION">I-vi-IV-V</field>
            <field name="KEY">C</field>
          </block>
          <block type="music_bass_line">
            <field name="PATTERN">walking</field>
            <field name="KEY">C</field>
          </block>
          <block type="music_harmony">
            <field name="INTERVAL">3rd</field>
          </block>
        </category>
        <category name="Dynamics" colour="#f39c12">
          <block type="music_volume">
            <field name="VOLUME">0.7</field>
          </block>
          <block type="music_crescendo">
            <field name="START">0.3</field>
            <field name="END">0.9</field>
          </block>
          <block type="music_accent">
            <field name="STRENGTH">1.5</field>
          </block>
        </category>
        <category name="Structure" colour="#95a5a6">
          <block type="music_repeat">
            <field name="TIMES">4</field>
          </block>
          <block type="music_verse">
            <field name="NAME">Verse 1</field>
          </block>
          <block type="music_chorus">
            <field name="NAME">Chorus</field>
          </block>
          <block type="music_bridge">
            <field name="NAME">Bridge</field>
          </block>
        </category>
        <category name="Effects" colour="#e67e22">
          <block type="music_reverb">
            <field name="AMOUNT">0.3</field>
          </block>
          <block type="music_delay">
            <field name="TIME">0.5</field>
          </block>
          <block type="music_filter">
            <field name="TYPE">lowpass</field>
            <field name="FREQUENCY">1000</field>
          </block>
        </category>
        <category name="Logic" colour="#34495e">
          <block type="controls_if"></block>
          <block type="controls_repeat_ext">
            <value name="TIMES">
              <shadow type="math_number">
                <field name="NUM">4</field>
              </shadow>
            </value>
          </block>
          <block type="logic_compare">
            <field name="OP">EQ</field>
          </block>
        </category>
        <category name="Variables" colour="#8e44ad" custom="VARIABLE"></category>
        <category name="Functions" colour="#2c3e50" custom="PROCEDURE"></category>
      </xml>
    `;

    // Define custom music blocks
    defineMusicBlocks();

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
          'insertionMarkerColour': '#f59e0b',
          'insertionMarkerOpacity': 0.3,
          'markerColour': '#f59e0b',
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

  const defineMusicBlocks = () => {
    // Define custom music blocks
    Blockly.Blocks['music_note'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('play note')
          .appendField(new Blockly.FieldDropdown([
            ['C', 'C'], ['C#', 'C#'], ['D', 'D'], ['D#', 'D#'],
            ['E', 'E'], ['F', 'F'], ['F#', 'F#'], ['G', 'G'],
            ['G#', 'G#'], ['A', 'A'], ['A#', 'A#'], ['B', 'B']
          ]), 'PITCH')
          .appendField('duration')
          .appendField(new Blockly.FieldNumber(1, 0.25, 8, 0.25), 'DURATION')
          .appendField('octave')
          .appendField(new Blockly.FieldNumber(4, 1, 8, 1), 'OCTAVE');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(231);
        this.setTooltip('Play a musical note');
      }
    };

    Blockly.Blocks['music_chord'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('play chord')
          .appendField(new Blockly.FieldDropdown([
            ['C', 'C'], ['Dm', 'Dm'], ['Em', 'Em'], ['F', 'F'],
            ['G', 'G'], ['Am', 'Am'], ['Bdim', 'Bdim']
          ]), 'CHORD')
          .appendField('duration')
          .appendField(new Blockly.FieldNumber(4, 1, 8, 1), 'DURATION')
          .appendField('octave')
          .appendField(new Blockly.FieldNumber(4, 1, 8, 1), 'OCTAVE');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(231);
        this.setTooltip('Play a chord');
      }
    };

    Blockly.Blocks['music_drum'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('play drum')
          .appendField(new Blockly.FieldDropdown([
            ['Kick', 'kick'], ['Snare', 'snare'], ['Hi-hat', 'hihat'],
            ['Crash', 'crash'], ['Ride', 'ride']
          ]), 'DRUM')
          .appendField('duration')
          .appendField(new Blockly.FieldNumber(1, 0.25, 4, 0.25), 'DURATION');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(61);
        this.setTooltip('Play a drum sound');
      }
    };

    Blockly.Blocks['music_rest'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('rest for')
          .appendField(new Blockly.FieldNumber(1, 0.25, 8, 0.25), 'DURATION')
          .appendField('beats');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip('Add a rest (silence)');
      }
    };

    // Add JavaScript generators for custom blocks
    javascriptGenerator['music_note'] = function(block: any) {
      const pitch = block.getFieldValue('PITCH');
      const duration = block.getFieldValue('DURATION');
      const octave = block.getFieldValue('OCTAVE');
      const code = `addNote('${pitch}', ${duration}, ${octave}, ${volume});\n`;
      return code;
    };

    javascriptGenerator['music_chord'] = function(block: any) {
      const chord = block.getFieldValue('CHORD');
      const duration = block.getFieldValue('DURATION');
      const octave = block.getFieldValue('OCTAVE');
      const code = `addChord('${chord}', ${duration}, ${octave}, ${volume});\n`;
      return code;
    };

    javascriptGenerator['music_drum'] = function(block: any) {
      const drum = block.getFieldValue('DRUM');
      const duration = block.getFieldValue('DURATION');
      const code = `addDrum('${drum}', ${duration}, ${volume});\n`;
      return code;
    };

    javascriptGenerator['music_rest'] = function(block: any) {
      const duration = block.getFieldValue('DURATION');
      const code = `addRest(${duration});\n`;
      return code;
    };
  };

  const playComposition = () => {
    if (!code.trim()) return;
    
    setIsPlaying(true);
    setComposition([]);
    setCurrentNote(-1);
    
    try {
      const notes: Note[] = [];
      
      // Create a safe execution environment
      const musicContext = {
        addNote: (pitch: string, duration: number, octave: number, vol: number) => {
          notes.push({ pitch, duration, octave, volume: vol });
        },
        addChord: (chord: string, duration: number, octave: number, vol: number) => {
          notes.push({ pitch: chord, duration, octave, volume: vol });
        },
        addDrum: (drum: string, duration: number, vol: number) => {
          notes.push({ pitch: drum, duration, octave: 0, volume: vol });
        },
        addRest: (duration: number) => {
          notes.push({ pitch: 'rest', duration, octave: 0, volume: 0 });
        }
      };
      
      // Execute the music code
      const func = new Function('addNote', 'addChord', 'addDrum', 'addRest', code);
      func(musicContext.addNote, musicContext.addChord, musicContext.addDrum, musicContext.addRest);
      
      setComposition(notes);
      
      // Play the composition
      playNotes(notes);
      
    } catch (error) {
      console.error('Music composition error:', error);
      setIsPlaying(false);
    }
  };

  const playNotes = (notes: Note[]) => {
    let currentIndex = 0;
    const beatDuration = 60000 / tempo; // milliseconds per beat
    
    const playNext = () => {
      if (currentIndex >= notes.length) {
        setIsPlaying(false);
        setCurrentNote(-1);
        return;
      }
      
      const note = notes[currentIndex];
      setCurrentNote(currentIndex);
      
      // Update visualizer
      const frequency = getFrequency(note.pitch, note.octave);
      setVisualizerData(prev => {
        const newData = [...prev, frequency];
        return newData.slice(-20); // Keep last 20 values
      });
      
      // Here you would actually play the audio
      // For now, we'll just simulate the timing
      console.log(`Playing: ${note.pitch} for ${note.duration} beats`);
      
      currentIndex++;
      setTimeout(playNext, beatDuration * note.duration);
    };
    
    playNext();
  };

  const getFrequency = (pitch: string, octave: number): number => {
    const notes = { C: 261.63, 'C#': 277.18, D: 293.66, 'D#': 311.13, E: 329.63, F: 349.23, 'F#': 369.99, G: 392.00, 'G#': 415.30, A: 440.00, 'A#': 466.16, B: 493.88 };
    const baseFreq = notes[pitch as keyof typeof notes] || 440;
    return baseFreq * Math.pow(2, octave - 4);
  };

  const stopComposition = () => {
    setIsPlaying(false);
    setCurrentNote(-1);
  };

  const resetComposition = () => {
    setIsPlaying(false);
    setComposition([]);
    setCurrentNote(-1);
    setVisualizerData([]);
  };

  const saveComposition = () => {
    const composition = {
      id: Date.now().toString(),
      title: `Composition ${savedCompositions.length + 1}`,
      template: selectedTemplate.id,
      code: code,
      notes: composition,
      tempo: tempo,
      createdAt: new Date().toISOString()
    };
    
    setSavedCompositions(prev => [...prev, composition]);
    alert('Composition saved successfully!');
  };

  const selectTemplate = (template: MusicTemplate) => {
    setSelectedTemplate(template);
    setTempo(template.tempo);
    resetComposition();
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

  const getGenreColor = (genre: string) => {
    switch (genre) {
      case 'Classical': return 'text-purple-600 bg-purple-100';
      case 'Pop': return 'text-pink-600 bg-pink-100';
      case 'Jazz': return 'text-orange-600 bg-orange-100';
      case 'Electronic': return 'text-cyan-600 bg-cyan-100';
      case 'World': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGenreIcon = (genre: string) => {
    switch (genre) {
      case 'Classical': return '🎼';
      case 'Pop': return '🎵';
      case 'Jazz': return '🎷';
      case 'Electronic': return '🎛️';
      case 'World': return '🌍';
      default: return '🎶';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-yellow-50 to-orange-100 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-3 rounded-lg">
            <Music className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Music Composer</h1>
            <p className="text-gray-600">Create beautiful music with visual blocks</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">Compositions:</span>
            <span className="bg-white text-orange-600 px-3 py-1 rounded-full font-semibold">
              {savedCompositions.length}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {musicTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => selectTemplate(template)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                selectedTemplate.id === template.id
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <span className="text-lg">{getGenreIcon(template.genre)}</span>
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
                  <span className="text-2xl">{getGenreIcon(selectedTemplate.genre)}</span>
                  {selectedTemplate.title}
                </h2>
                <p className="text-gray-600 mb-3">{selectedTemplate.description}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                {selectedTemplate.difficulty}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenreColor(selectedTemplate.genre)}`}>
                {selectedTemplate.genre}
              </span>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-orange-800 mb-2">Music Settings</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-700">Tempo:</span>
                  <span className="text-sm font-medium text-orange-800">{selectedTemplate.tempo} BPM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-700">Time Signature:</span>
                  <span className="text-sm font-medium text-orange-800">{selectedTemplate.timeSignature}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-700">Key:</span>
                  <span className="text-sm font-medium text-orange-800">{selectedTemplate.key}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Objectives</h3>
              <ul className="space-y-1">
                {selectedTemplate.objectives.map((objective, index) => (
                  <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">♪</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Controls
              </h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-sm text-yellow-600 hover:text-yellow-800"
              >
                {showSettings ? 'Hide' : 'Show'}
              </button>
            </div>
            
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volume: {Math.round(volume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo: {tempo} BPM
                    </label>
                    <input
                      type="range"
                      min="60"
                      max="200"
                      step="1"
                      value={tempo}
                      onChange={(e) => setTempo(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Blockly Editor */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Waves className="h-5 w-5" />
                  <span className="font-semibold">Music Block Editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={isPlaying ? stopComposition : playComposition}
                    disabled={!code.trim()}
                    className="bg-white text-yellow-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Play
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetComposition}
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
                  <Volume2 className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Composition</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveComposition}
                    disabled={!code.trim() || composition.length === 0}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hints */}
          <div className="mt-4 bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Music Tips
              </h3>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-sm text-yellow-600 hover:text-yellow-800"
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
                      🎵 {hint}
                    </motion.div>
                  ))}
                  {currentHint < selectedTemplate.hints.length - 1 && (
                    <button
                      onClick={showNextHint}
                      className="text-sm text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
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

        {/* Visualizer and Composition */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  <span className="font-semibold">Music Visualizer</span>
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
            
            <div className="h-64 bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
              <div className="h-full flex items-end justify-center gap-1">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-orange-500 to-yellow-500 rounded-t-lg transition-all duration-300"
                    style={{
                      width: '8px',
                      height: `${Math.max(10, (visualizerData[i] || 0) / 10)}%`,
                      opacity: isPlaying ? 1 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Composition:</span>
                <span className="text-sm text-gray-600">{composition.length} notes</span>
              </div>
              
              <div className="max-h-32 overflow-y-auto">
                {composition.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Your composition will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {composition.map((note, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm transition-all ${
                          currentNote === index
                            ? 'bg-yellow-200 text-yellow-800 shadow-md'
                            : 'bg-white text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{note.pitch}</span>
                          <span className="text-xs">{note.duration} beats</span>
                        </div>
                        {note.octave > 0 && (
                          <div className="text-xs text-gray-500">Octave {note.octave}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 