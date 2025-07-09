'use client';

import { Book, HelpCircle, Menu, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { title: 'Introduction to Biology', active: true },
  { title: 'Cell Structure', active: false },
  { title: 'Photosynthesis', active: false },
  { title: 'Cellular Respiration', active: false },
  { title: 'Genetics Basics', active: false },
];

const questionItems = [
  'What is photosynthesis?',
  'How do cells divide?',
  'What is DNA?',
  'How do enzymes work?',
  'What is evolution?',
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Book className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-gray-900">BrainStarta</h1>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className={`text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? 'M' : 'Menu'}
          </h2>
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className={`w-2 h-2 rounded-full ${item.active ? 'bg-blue-500' : 'bg-gray-300'}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{item.title}</span>
                    {item.active && <ChevronRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Questions Section */}
        <div className="p-4 border-t border-gray-200">
          <h2 className={`text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? 'Q' : 'Questions'}
          </h2>
          <div className="space-y-3">
            {questionItems.map((question, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <HelpCircle className="w-4 h-4 text-gray-400" />
                {!isCollapsed && (
                  <span className="flex-1 text-left text-sm">{question}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}