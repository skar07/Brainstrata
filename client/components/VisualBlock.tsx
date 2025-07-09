'use client';

import { useState } from 'react';
import { ArrowRight, ArrowDown, ArrowLeft, ArrowUp, Play } from 'lucide-react';

interface VisualBlockProps {
  type: 'grid' | 'flowchart' | 'diagram';
  title: string;
  interactive?: boolean;
}

export default function VisualBlock({ type, title, interactive = false }: VisualBlockProps) {
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  const renderGrid = () => {
    const cells = Array.from({ length: 16 }, (_, i) => i);
    
    return (
      <div className="grid grid-cols-4 gap-2 p-4">
        {cells.map((cell) => (
          <div
            key={cell}
            className={`w-12 h-12 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedCell === cell
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            onClick={() => interactive && setSelectedCell(cell)}
          />
        ))}
      </div>
    );
  };

  const renderFlowchart = () => {
    const steps = ['Input', 'Process', 'Output'];
    
    return (
      <div className="flex items-center justify-center p-8 space-x-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
              animationStep >= index
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-600'
            }`}>
              <span className="font-medium">{step}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className={`w-6 h-6 mx-3 transition-colors duration-300 ${
                animationStep > index ? 'text-blue-500' : 'text-gray-400'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderDiagram = () => {
    return (
      <div className="p-8">
        <div className="relative w-full h-48 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-gray-200">
          {/* Sun */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-yellow-500 rounded-full" />
          </div>
          
          {/* Plant */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-20 bg-green-500 rounded-t-full" />
            <div className="w-4 h-8 bg-green-700 mx-auto" />
          </div>
          
          {/* Arrows */}
          <div className="absolute top-12 right-16">
            <ArrowDown className="w-6 h-6 text-yellow-600" />
          </div>
          
          <div className="absolute bottom-12 left-8">
            <ArrowUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'grid':
        return renderGrid();
      case 'flowchart':
        return renderFlowchart();
      case 'diagram':
        return renderDiagram();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {interactive && type === 'flowchart' && (
          <button
            onClick={() => setAnimationStep((prev) => (prev + 1) % 4)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span className="text-sm">Animate</span>
          </button>
        )}
      </div>
      {renderContent()}
    </div>
  );
}