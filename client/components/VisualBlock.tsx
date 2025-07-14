'use client';

import { useState } from 'react';
import { ArrowRight, ArrowDown, ArrowLeft, ArrowUp, Play, Pause, RotateCw, Zap, Lightbulb, Leaf } from 'lucide-react';

interface VisualBlockProps {
  type: 'grid' | 'flowchart' | 'diagram';
  title: string;
  interactive?: boolean;
}

export default function VisualBlock({ type, title, interactive = false }: VisualBlockProps) {
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const renderGrid = () => {
    const cells = Array.from({ length: 16 }, (_, i) => i);
    const cellLabels = [
      'Thylakoid', 'Stroma', 'Grana', 'Chloroplast',
      'ATP', 'NADPH', 'RuBisCO', 'Calvin Cycle',
      'Light', 'H2O', 'CO2', 'O2',
      'Glucose', 'Energy', 'Photon', 'Electron'
    ];
    
    return (
      <div className="grid grid-cols-4 gap-2 p-4">
        {cells.map((cell) => (
          <div
            key={cell}
            className={`relative w-12 h-12 rounded-lg cursor-pointer transition-all duration-300 group ${
              selectedCell === cell
                ? 'glass backdrop-blur-sm border-2 border-purple-500 shadow-lg scale-105'
                : 'glass backdrop-blur-sm border border-white/20 hover:border-purple-400 hover:scale-110 hover:shadow-lg'
            }`}
            onClick={() => interactive && setSelectedCell(cell)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 p-1.5 flex flex-col items-center justify-center h-full">
              <div className={`w-4 h-4 rounded mb-1 ${
                selectedCell === cell
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                  : 'bg-gradient-to-br from-gray-400 to-gray-500'
              }`} />
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                {cellLabels[cell]}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFlowchart = () => {
    const steps = [
      { label: 'Light Energy', icon: Lightbulb, color: 'from-yellow-400 to-orange-500' },
      { label: 'Chloroplast', icon: Leaf, color: 'from-green-400 to-emerald-500' },
      { label: 'ATP + NADPH', icon: Zap, color: 'from-blue-400 to-purple-500' },
      { label: 'Glucose', icon: RotateCw, color: 'from-purple-400 to-pink-500' }
    ];
    
    return (
      <div className="flex items-center justify-center p-5 space-x-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`relative glass backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all duration-500 ${
              animationStep >= index
                ? 'shadow-lg scale-105 border-purple-500/50'
                : 'hover:scale-105 hover:shadow-md'
            }`}>
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl opacity-0 transition-opacity duration-500 ${
                animationStep >= index ? 'opacity-20' : ''
              }`} />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br ${step.color} shadow-lg`}>
                  <step.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-800 text-xs text-center">{step.label}</span>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex items-center mx-3">
                <ArrowRight className={`w-5 h-5 transition-all duration-500 ${
                  animationStep > index 
                    ? 'text-purple-500 scale-110' 
                    : 'text-gray-400'
                }`} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderDiagram = () => {
    return (
      <div className="p-5">
        <div className="relative w-full h-48 glass backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 opacity-50" />
          
          {/* Sun */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
            <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full" />
            <div className="absolute inset-0 rounded-full bg-yellow-300 animate-ping opacity-20" />
          </div>
          
          {/* Plant */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-float">
            <div className="relative">
              <div className="w-14 h-16 bg-gradient-to-t from-green-600 to-green-400 rounded-t-full shadow-lg" />
              <div className="w-4 h-8 bg-gradient-to-b from-green-700 to-green-800 mx-auto shadow-md" />
              
              {/* Leaves */}
              <div className="absolute top-3 -left-1.5 w-6 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full transform -rotate-45" />
              <div className="absolute top-3 -right-1.5 w-6 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full transform rotate-45" />
            </div>
          </div>
          
          {/* Light rays */}
          <div className="absolute top-12 right-8 animate-bounce">
            <ArrowDown className="w-5 h-5 text-yellow-500" />
            <div className="absolute -top-0.5 -left-0.5 w-6 h-6 bg-yellow-300 rounded-full opacity-30 animate-ping" />
          </div>
          
          {/* Oxygen bubbles */}
          <div className="absolute bottom-12 left-6 animate-float">
            <ArrowUp className="w-5 h-5 text-green-500" />
            <div className="absolute -top-0.5 -left-0.5 w-6 h-6 bg-green-300 rounded-full opacity-30 animate-ping" />
          </div>
          
          {/* CO2 */}
          <div className="absolute top-1/2 left-6 transform -translate-y-1/2">
            <div className="flex items-center gap-1.5 glass backdrop-blur-sm rounded p-1.5 border border-white/20">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="text-xs font-medium text-gray-600">CO₂</span>
            </div>
          </div>
          
          {/* H2O */}
          <div className="absolute bottom-1/3 right-1/3">
            <div className="flex items-center gap-1.5 glass backdrop-blur-sm rounded p-1.5 border border-white/20">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-xs font-medium text-gray-600">H₂O</span>
            </div>
          </div>
          
          {/* Glucose */}
          <div className="absolute top-1/3 right-6">
            <div className="flex items-center gap-1.5 glass backdrop-blur-sm rounded p-1.5 border border-white/20">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span className="text-xs font-medium text-gray-600">C₆H₁₂O₆</span>
            </div>
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

  const handleAnimation = () => {
    if (isAnimating) {
      setIsAnimating(false);
      return;
    }
    
    setIsAnimating(true);
    setAnimationStep(0);
    
    const interval = setInterval(() => {
      setAnimationStep((prev) => {
        if (prev >= 3) {
          setIsAnimating(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <div className="glass backdrop-blur-xl rounded-xl border border-white/20 shadow-xl card-hover">
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
            {type === 'grid' && <RotateCw className="w-3 h-3 text-white" />}
            {type === 'flowchart' && <ArrowRight className="w-3 h-3 text-white" />}
            {type === 'diagram' && <Lightbulb className="w-3 h-3 text-white" />}
          </div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
        
        {interactive && type === 'flowchart' && (
          <button
            onClick={handleAnimation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {isAnimating ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            <span className="text-xs font-medium">
              {isAnimating ? 'Pause' : 'Animate'}
            </span>
          </button>
        )}
        
        {interactive && type === 'grid' && selectedCell !== null && (
          <div className="flex items-center gap-1.5 px-2 py-1 glass backdrop-blur-sm rounded border border-white/20">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            <span className="text-xs font-medium text-gray-700">
              Cell {selectedCell + 1} selected
            </span>
          </div>
        )}
      </div>
      
      {renderContent()}
    </div>
  );
}