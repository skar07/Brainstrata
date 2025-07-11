'use client';
import { motion } from 'framer-motion';
import { BookOpen, Brain } from 'lucide-react';

type DemoView = 'home' | 'puzzle' | 'quiz' | 'progress' | 'ai-integration' | 'blockly-logic' | 'blockly-algorithm' | 'blockly-physics' | 'blockly-story' | 'blockly-music' | 'blockly-math';

interface NavigationProps {
  currentView: DemoView;
  onHomeClick: () => void;
}

export default function Navigation({ currentView, onHomeClick }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">BrainStrata</h1>
              {currentView !== 'home' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-xs text-gray-500"
                >
                  {currentView.startsWith('blockly-') ? (
                    <>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span>AI Powered Learning</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Interactive Learning</span>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
          
          {currentView !== 'home' && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onHomeClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <BookOpen className="h-4 w-4" />
              Back to Home
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
} 