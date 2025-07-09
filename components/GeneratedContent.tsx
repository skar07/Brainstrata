'use client';

import { useState } from 'react';
import VisualBlock from './VisualBlock';
import { ChevronRight, BookOpen, Lightbulb, CheckCircle } from 'lucide-react';

export default function GeneratedContent() {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "Introduction to Photosynthesis",
      content: "Photosynthesis is the biological process by which plants, algae, and certain bacteria convert light energy into chemical energy. This fundamental process sustains virtually all life on Earth by producing oxygen and glucose.",
      icon: BookOpen,
    },
    {
      title: "The Light-Dependent Reactions",
      content: "The first stage of photosynthesis occurs in the thylakoid membranes of chloroplasts. Here, chlorophyll absorbs light energy and converts it into chemical energy in the form of ATP and NADPH.",
      icon: Lightbulb,
    },
    {
      title: "The Calvin Cycle",
      content: "The second stage takes place in the stroma, where CO₂ is fixed into glucose using the ATP and NADPH produced in the light reactions. This cycle is also known as the light-independent reactions.",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span>Biology</span>
            <ChevronRight className="w-4 h-4" />
            <span>Cell Processes</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium">Photosynthesis</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Understanding Photosynthesis
          </h1>
          <p className="text-xl text-gray-600">
            Explore how plants convert sunlight into energy through this interactive lesson.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(((currentSection + 1) / sections.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`transition-all duration-300 ${
                index <= currentSection ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">{section.content}</p>
                
                {index === currentSection && (
                  <button
                    onClick={() => setCurrentSection(prev => Math.min(prev + 1, sections.length - 1))}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    {index === sections.length - 1 ? 'Complete Lesson' : 'Continue'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Visual Blocks */}
        <div className="mt-12 space-y-8">
          <VisualBlock 
            type="diagram" 
            title="Photosynthesis Process" 
            interactive={true}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VisualBlock 
              type="grid" 
              title="Chloroplast Structure" 
              interactive={true}
            />
            <VisualBlock 
              type="flowchart" 
              title="Energy Conversion Steps" 
              interactive={true}
            />
          </div>
        </div>

        {/* Key Concepts */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Key Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { term: "Chlorophyll", definition: "The green pigment that captures light energy" },
              { term: "ATP", definition: "Adenosine triphosphate, the energy currency of cells" },
              { term: "NADPH", definition: "Electron carrier that provides reducing power" },
              { term: "Carbon Fixation", definition: "Process of converting CO₂ into organic compounds" },
            ].map((concept, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{concept.term}</h4>
                <p className="text-sm text-gray-600">{concept.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}