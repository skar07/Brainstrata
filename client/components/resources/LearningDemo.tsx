'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, BookOpen, Target, BarChart3, ChevronRight, Code, Brain, Trophy, Sparkles,
  Puzzle, Lightbulb, Calculator, Microscope, BookText, Cpu, Rocket, Home, ArrowLeft
} from 'lucide-react';
import DragDropPuzzle from './DragDropPuzzle';
import InteractiveQuestionnaire from './InteractiveQuestionnaire';
import LearningProgressTracker from './LearningProgressTracker';
import BlocklyLogicQuiz from './BlocklyLogicQuiz';
import BlocklyAlgorithmChallenge from './BlocklyAlgorithmChallenge';
import BlocklyPhysicsSimulator from './BlocklyPhysicsSimulator';
import BlocklyStoryBuilder from './BlocklyStoryBuilder';
import BlocklyMusicComposer from './BlocklyMusicComposer';
import BlocklyMathSolver from './BlocklyMathSolver';
// Brain Storming Activities
import ImageFinder from './ImageFinder';
import PatternMatching from './PatternMatching';
import MemoryGames from './MemoryGames';
import ShapeBuilder from './ShapeBuilder';
// Logical Thinking Activities
import LogicQuestions from './LogicQuestions';
import TrueFalseQuiz from './TrueFalseQuiz';
import DigitalCircuits from './DigitalCircuits';
// New Interactive Components
import MathChallenges from './MathChallenges';
import EnglishLogic from './EnglishLogic';
import ScienceReasoning from './ScienceReasoning';
import TechLogic from './TechLogic';
import CreativePuzzles from './CreativePuzzles';

type DemoView = 
  | 'home' 
  | 'brainstorming' 
  | 'logical-thinking' 
  | 'programming-cs' 
  | 'mathematics' 
  | 'sciences' 
  | 'language-arts' 
  | 'technology-innovation'
  // Brain Storming Activities
  | 'puzzle-solver'
  | 'image-finder'
  | 'pattern-matching'
  | 'memory-games'
  | 'shape-builder'
  | 'creative-puzzles'
  // Logical Thinking Activities
  | 'logic-questions'
  | 'true-false-quiz'
  | 'digital-circuits'
  | 'math-challenges'
  | 'english-logic'
  | 'science-reasoning'
  | 'tech-logic'
  | 'programming-logic'
  // Original activities
  | 'puzzle' 
  | 'quiz' 
  | 'progress' 
  | 'blockly-logic' 
  | 'blockly-algorithm' 
  | 'blockly-physics' 
  | 'blockly-story' 
  | 'blockly-music' 
  | 'blockly-math';

const learningCourses = [
  {
    id: 'brainstorming',
    title: 'Brain Storming',
    description: 'Creative problem solving, pattern recognition, and visual challenges',
    icon: <Puzzle className="h-8 w-8" />,
    color: 'from-emerald-500 to-teal-600',
    bgPattern: 'puzzle-pattern',
    activities: [
      { name: 'Puzzle Solver', description: 'Interactive logic puzzles with drag & drop', type: 'puzzle-solver' },
      { name: 'Image Finding', description: 'Find hidden objects and patterns', type: 'image-finder' },
      { name: 'Pattern Matching', description: 'Match shapes, colors, and sequences', type: 'pattern-matching' },
      { name: 'Memory Games', description: 'Visual memory and recall challenges', type: 'memory-games' },
      { name: 'Shape Builder', description: 'Build and create with draggable shapes', type: 'shape-builder' },
      { name: 'Creative Puzzles', description: 'Open-ended creative problem solving', type: 'creative-puzzles' }
    ],
    stats: { challenges: 60, difficulty: 'Beginner to Expert', avgTime: '15-30 min' }
  },
  {
    id: 'logical-thinking',
    title: 'Logical Thinking',
    description: 'Multi-subject reasoning and analytical thinking challenges',
    icon: <Lightbulb className="h-8 w-8" />,
    color: 'from-purple-500 to-indigo-600',
    bgPattern: 'logic-pattern',
    activities: [
      { name: 'Logic Questions', description: 'Boolean logic and reasoning puzzles', type: 'logic-questions' },
      { name: 'True/False Quiz', description: 'Critical thinking true/false challenges', type: 'true-false-quiz' },
      { name: 'Digital Circuits', description: 'Interactive circuit logic simulation', type: 'digital-circuits' },
      { name: 'Math Challenges', description: 'Mathematical reasoning and problem solving', type: 'math-challenges' },
      { name: 'English Logic', description: 'Language-based logical reasoning', type: 'english-logic' },
      { name: 'Science Reasoning', description: 'Scientific method and logical thinking', type: 'science-reasoning' },
      { name: 'Tech Logic', description: 'Technology and innovation reasoning', type: 'tech-logic' },
      { name: 'Programming Logic', description: 'Computational thinking challenges', type: 'programming-logic' }
    ],
    stats: { challenges: 150, difficulty: 'All Levels', avgTime: '10-25 min' }
  },
  {
    id: 'programming-cs',
    title: 'Programming & CS',
    description: 'Computer science concepts with visual programming',
    icon: <Code className="h-8 w-8" />,
    color: 'from-blue-500 to-cyan-600',
    bgPattern: 'code-pattern',
    activities: [
      { name: 'Blockly Programming', description: 'Visual programming basics', type: 'blockly-logic' },
      { name: 'Algorithm Design', description: 'Interactive algorithm building', type: 'blockly-algorithm' },
      { name: 'Data Structures', description: 'Visual data structure exploration', type: 'data-structures' },
      { name: 'CS Fundamentals', description: 'Core computer science concepts', type: 'cs-basics' }
    ],
    stats: { challenges: 80, difficulty: 'Beginner to Advanced', avgTime: '20-45 min' }
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Interactive mathematical problem solving and visualization',
    icon: <Calculator className="h-8 w-8" />,
    color: 'from-orange-500 to-red-600',
    bgPattern: 'math-pattern',
    activities: [
      { name: 'Math Solver', description: 'Step-by-step problem solving', type: 'blockly-math' },
      { name: 'Geometry Lab', description: 'Interactive geometric constructions', type: 'geometry' },
      { name: 'Algebra Challenges', description: 'Equation solving games', type: 'algebra' },
      { name: 'Statistics Fun', description: 'Data analysis and probability', type: 'statistics' }
    ],
    stats: { challenges: 95, difficulty: 'Elementary to Calculus', avgTime: '15-40 min' }
  },
  {
    id: 'sciences',
    title: 'Sciences',
    description: 'Interactive science experiments and simulations',
    icon: <Microscope className="h-8 w-8" />,
    color: 'from-green-500 to-emerald-600',
    bgPattern: 'science-pattern',
    activities: [
      { name: 'Physics Lab', description: 'Interactive physics simulations', type: 'blockly-physics' },
      { name: 'Chemistry Studio', description: 'Molecular modeling and reactions', type: 'chemistry' },
      { name: 'Biology Explorer', description: 'Life science investigations', type: 'biology' },
      { name: 'Earth Science', description: 'Environmental science challenges', type: 'earth-science' }
    ],
    stats: { challenges: 75, difficulty: 'Middle School to University', avgTime: '20-35 min' }
  },
  {
    id: 'language-arts',
    title: 'Language Arts',
    description: 'Interactive language learning and literary analysis',
    icon: <BookText className="h-8 w-8" />,
    color: 'from-pink-500 to-rose-600',
    bgPattern: 'language-pattern',
    activities: [
      { name: 'Story Builder', description: 'Interactive narrative creation', type: 'blockly-story' },
      { name: 'Vocabulary Games', description: 'Word building and definitions', type: 'vocabulary' },
      { name: 'Grammar Detective', description: 'Interactive grammar exercises', type: 'grammar' },
      { name: 'Reading Comprehension', description: 'Text analysis challenges', type: 'reading' }
    ],
    stats: { challenges: 60, difficulty: 'Elementary to Advanced', avgTime: '15-30 min' }
  },
  {
    id: 'technology-innovation',
    title: 'Technology & Innovation',
    description: 'Explore cutting-edge technology and innovation concepts',
    icon: <Rocket className="h-8 w-8" />,
    color: 'from-violet-500 to-purple-600',
    bgPattern: 'tech-pattern',
    activities: [
      { name: 'AI Fundamentals', description: 'Machine learning basics', type: 'ai-basics' },
      { name: 'Robotics Simulator', description: 'Virtual robot programming', type: 'robotics' },
      { name: 'Tech Trends', description: 'Emerging technology exploration', type: 'tech-trends' },
      { name: 'Innovation Lab', description: 'Creative technology projects', type: 'innovation' }
    ],
    stats: { challenges: 50, difficulty: 'Intermediate to Expert', avgTime: '25-50 min' }
  }
];

export default function LearningDemo() {
  const [currentView, setCurrentView] = useState<DemoView>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<typeof learningCourses[0] | null>(null);

  const handleViewChange = (view: DemoView) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsLoading(false);
    }, 300);
  };

  const handleCourseSelect = (course: typeof learningCourses[0]) => {
    setSelectedCourse(course);
    setCurrentView(course.id as DemoView);
  };

  const renderView = () => {
    switch (currentView) {
      case 'puzzle':
        return <DragDropPuzzle />;
      case 'quiz':
        return <InteractiveQuestionnaire />;
      case 'progress':
        return <LearningProgressTracker />;
      case 'blockly-logic':
        return <LogicQuestions />;
      case 'blockly-algorithm':
        return <BlocklyAlgorithmChallenge />;
      case 'blockly-math':
        return <BlocklyMathSolver />;
      case 'blockly-physics':
        return <BlocklyPhysicsSimulator />;
      case 'blockly-story':
        return <BlocklyStoryBuilder />;
      case 'blockly-music':
        return <BlocklyMusicComposer />;
      // Brain Storming Activities
      case 'image-finder':
        return <ImageFinder />;
      case 'pattern-matching':
        return <PatternMatching />;
      case 'memory-games':
        return <MemoryGames />;
      case 'shape-builder':
        return <ShapeBuilder />;
      case 'puzzle-solver':
        return <DragDropPuzzle />;
      case 'creative-puzzles':
        return <CreativePuzzles />;
      // Logical Thinking Activities - Now with proper components
      case 'logic-questions':
        return <LogicQuestions />;
      case 'true-false-quiz':
        return <TrueFalseQuiz />;
      case 'digital-circuits':
        return <DigitalCircuits />;
      case 'math-challenges':
        return <MathChallenges />;
      case 'english-logic':
        return <EnglishLogic />;
      case 'science-reasoning':
        return <ScienceReasoning />;
      case 'tech-logic':
        return <TechLogic />;
      case 'programming-logic':
        return <LogicQuestions />;
      case 'brainstorming':
      case 'logical-thinking':
      case 'programming-cs':
      case 'mathematics':
      case 'sciences':
      case 'language-arts':
      case 'technology-innovation':
        return <CourseDetailView course={selectedCourse} onActivitySelect={handleViewChange} />;
      default:
        return <HomeView onCourseSelect={handleCourseSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl shadow-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">BrainStrata</h1>
                {currentView !== 'home' && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <motion.div 
                      className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span>Interactive Learning Platform</span>
                  </div>
                )}
              </div>
            </motion.div>
            
            {currentView !== 'home' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCourse(null);
                  setCurrentView('home');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="text-center">
                <motion.div 
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4"
                  style={{ borderImage: 'linear-gradient(45deg, #3B82F6, #8B5CF6) 1' }}
                />
                <p className="text-gray-600">Loading amazing content...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function HomeView({ onCourseSelect }: { onCourseSelect: (course: typeof learningCourses[0]) => void }) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Master Learning Through{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interactive Experiences
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
            Explore 7 specialized learning sections with <strong>animated</strong>, <strong>draggable</strong>, 
            and <strong>interactive</strong> content. From brain-storming puzzles to advanced programming concepts.
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-8">
            <motion.div 
              className="flex items-center gap-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>7 Learning Sections</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span>Interactive & Animated</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Blockly Programming</span>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCourseSelect(learningCourses[0])}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Puzzle className="h-5 w-5" />
              Start Brain Storming
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCourseSelect(learningCourses[1])}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Lightbulb className="h-5 w-5" />
              Logical Thinking
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCourseSelect(learningCourses[2])}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg"
            >
              <Code className="h-5 w-5" />
              Programming & CS
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Learning Courses Grid */}
      <div className="space-y-8">
        <motion.h3 
          className="text-3xl font-bold text-center text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Choose Your Learning Journey
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {learningCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
              onClick={() => onCourseSelect(course)}
            >
              {/* Header with gradient background */}
              <div className={`h-32 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-5 transition-all duration-300" />
                
                {/* Animated background elements */}
                <motion.div 
                  className="absolute top-4 right-4 opacity-20"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-8 h-8 bg-white rounded-lg" />
                </motion.div>
                
                <div className="absolute bottom-4 left-4 text-white">
                  <motion.div 
                    className="mb-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    {course.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold leading-tight">{course.title}</h3>
                </div>
                
                <motion.div 
                  className="absolute top-4 left-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="h-5 w-5 text-white opacity-70" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{course.description}</p>
                
                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Challenges:</span>
                    <span className="font-semibold">{course.stats.challenges}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Level:</span>
                    <span className="font-semibold">{course.stats.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Avg Time:</span>
                    <span className="font-semibold">{course.stats.avgTime}</span>
                  </div>
                </div>

                {/* Activities preview */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Activities:</p>
                  {course.activities.slice(0, 2).map((activity, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <motion.div 
                        className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                      />
                      <span>{activity.name}</span>
                    </div>
                  ))}
                  {course.activities.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{course.activities.length - 2} more activities
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CourseDetailView({ 
  course, 
  onActivitySelect 
}: { 
  course: typeof learningCourses[0] | null;
  onActivitySelect: (view: DemoView) => void;
}) {
  if (!course) return null;

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <motion.div 
        className={`rounded-3xl overflow-hidden bg-gradient-to-br ${course.color} p-8 text-white relative`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {course.icon}
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-white/80">{course.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{course.stats.challenges}</div>
              <div className="text-white/80 text-sm">Challenges</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-lg font-bold">{course.stats.difficulty}</div>
              <div className="text-white/80 text-sm">Difficulty</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-lg font-bold">{course.stats.avgTime}</div>
              <div className="text-white/80 text-sm">Avg Time</div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <motion.div 
          className="absolute top-4 right-4 opacity-10"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-32 h-32 bg-white rounded-full" />
        </motion.div>
      </motion.div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {course.activities.map((activity, index) => (
          <motion.div
            key={activity.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
            onClick={() => onActivitySelect(activity.type as DemoView)}
          >
            <div className={`h-24 bg-gradient-to-r ${course.color} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-5 transition-all duration-300" />
              <motion.div 
                className="absolute top-4 right-4"
                whileHover={{ x: 5 }}
              >
                <ChevronRight className="h-5 w-5 text-white opacity-70" />
              </motion.div>
              <motion.div 
                className="absolute top-4 left-4"
                whileHover={{ scale: 1.2 }}
              >
                <Play className="h-5 w-5 text-white" />
              </motion.div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{activity.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <motion.div 
                  className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
                <span>Interactive & Animated</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}