'use client';

import { useState } from 'react';
import VisualBlock from './VisualBlock';
import { ChevronRight, BookOpen, Lightbulb, CheckCircle, Star, Award, Clock, Users, TrendingUp, Target, Zap } from 'lucide-react';

export default function GeneratedContent() {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "Introduction to Photosynthesis",
      content: "Photosynthesis is the biological process by which plants, algae, and certain bacteria convert light energy into chemical energy. This fundamental process sustains virtually all life on Earth by producing oxygen and glucose.",
      icon: BookOpen,
      color: "from-emerald-400 via-teal-500 to-cyan-600",
      shadowColor: "shadow-emerald-500/25",
      difficulty: "Beginner",
      duration: "5 min",
    },
    {
      title: "The Light-Dependent Reactions",
      content: "The first stage of photosynthesis occurs in the thylakoid membranes of chloroplasts. Here, chlorophyll absorbs light energy and converts it into chemical energy in the form of ATP and NADPH.",
      icon: Lightbulb,
      color: "from-amber-400 via-orange-500 to-red-500",
      shadowColor: "shadow-amber-500/25",
      difficulty: "Intermediate",
      duration: "8 min",
    },
    {
      title: "The Calvin Cycle",
      content: "The second stage takes place in the stroma, where CO₂ is fixed into glucose using the ATP and NADPH produced in the light reactions. This cycle is also known as the light-independent reactions.",
      icon: CheckCircle,
      color: "from-purple-400 via-violet-500 to-indigo-600",
      shadowColor: "shadow-purple-500/25",
      difficulty: "Advanced",
      duration: "12 min",
    },
  ];

  const stats = [
    { icon: Users, value: "2.4K", label: "Students", color: "from-blue-500 to-cyan-500" },
    { icon: Star, value: "4.8", label: "Rating", color: "from-yellow-400 to-orange-500" },
    { icon: Award, value: "95%", label: "Completion", color: "from-green-500 to-emerald-500" },
    { icon: Clock, value: "25", label: "Minutes", color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-y-auto relative">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-300/30 via-pink-300/20 to-violet-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-300/30 via-cyan-300/20 to-teal-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/20 via-teal-300/10 to-cyan-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-32 left-32 text-purple-300/20 animate-float">
          <Star className="w-6 h-6" />
        </div>
        <div className="absolute top-64 right-64 text-pink-300/20 animate-float animation-delay-2000">
          <Zap className="w-5 h-5" />
        </div>
        <div className="absolute bottom-32 left-64 text-blue-300/20 animate-float animation-delay-4000">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 relative z-10 w-full">
        {/* Enhanced Header */}
        <div className="mb-6 md:mb-8 animate-fadeInUp">
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-5">
            <span className="hover:text-purple-600 transition-colors cursor-pointer font-medium px-2 py-0.5 rounded-full hover:bg-purple-50">Biology</span>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="hover:text-purple-600 transition-colors cursor-pointer font-medium px-2 py-0.5 rounded-full hover:bg-purple-50">Cell Processes</span>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-gradient font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-50 to-pink-50">Photosynthesis</span>
          </nav>
          
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 md:gap-5 lg:gap-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                Understanding{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
                  Photosynthesis
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-full xl:max-w-2xl">
                Explore how plants convert sunlight into energy through this interactive, 
                beautifully crafted lesson experience designed for modern learners.
              </p>
            </div>
            
            {/* Enhanced Stats - More Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/50 hover:bg-white/90">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mx-auto mb-2 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar - More Responsive */}
        <div className="mb-6 md:mb-8 animate-fadeInUp">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">Learning Progress</h3>
            <span className="text-xs sm:text-sm text-gray-600 font-semibold bg-gradient-to-r from-purple-50 to-pink-50 px-2 sm:px-3 py-1 rounded-full">
              {Math.round(((currentSection + 1) / sections.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full h-2 sm:h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-violet-600 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 via-pink-400/50 to-violet-400/50 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Sections - More Responsive */}
        <div className="space-y-4 md:space-y-5 lg:space-y-6 mb-10 md:mb-12">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                index <= currentSection ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-4'
              }`}
            >
              <div className={`bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 ${section.shadowColor} hover:scale-[1.02] group`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-5 mb-4 md:mb-5">
                  <div className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-lg animate-float group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <section.icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 md:gap-3 mb-2 md:mb-3">
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{section.title}</h2>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
                          {section.difficulty}
                        </span>
                        <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
                          {section.duration}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                </div>
                
                {index === currentSection && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 animate-fadeInUp">
                    <button
                      onClick={() => setCurrentSection(prev => Math.min(prev + 1, sections.length - 1))}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-violet-600 text-white font-semibold py-3 px-4 md:px-6 rounded-xl transition-all duration-300 hover:from-purple-600 hover:via-pink-600 hover:to-violet-700 hover:scale-105 hover:shadow-lg shadow-purple-500/25 group flex items-center justify-center gap-2"
                    >
                      <span className="text-sm md:text-base">
                        {index === sections.length - 1 ? 'Complete Lesson' : 'Continue Learning'}
                      </span>
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="bg-white/80 backdrop-blur-sm text-gray-700 font-semibold py-3 px-4 md:px-6 rounded-xl border-2 border-gray-200 transition-all duration-300 hover:bg-white hover:border-purple-300 hover:text-purple-700 hover:scale-105 shadow-sm text-sm md:text-base">
                      Take Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Visual Blocks - More Responsive */}
        <div className="space-y-4 md:space-y-6 mb-10 md:mb-12">
          <div className="text-center mb-4 md:mb-5">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3">Interactive Visualizations</h3>
            <p className="text-sm md:text-base text-gray-600 max-w-full md:max-w-xl mx-auto">
              Explore complex concepts through beautifully designed interactive elements
            </p>
          </div>
          
          <div className="animate-fadeInUp">
            <VisualBlock 
              type="diagram" 
              title="Photosynthesis Process" 
              interactive={true}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 animate-fadeInUp">
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

        {/* Enhanced Key Concepts - More Responsive */}
        <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 border border-white/60 shadow-xl animate-fadeInUp mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Key Concepts</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {[
              { 
                term: "Chlorophyll", 
                definition: "The green pigment that captures light energy and converts it into chemical energy",
                color: "from-emerald-400 to-teal-500",
                icon: "🌿"
              },
              { 
                term: "ATP", 
                definition: "Adenosine triphosphate, the universal energy currency of all living cells",
                color: "from-blue-500 to-cyan-500",
                icon: "⚡"
              },
              { 
                term: "NADPH", 
                definition: "Electron carrier that provides reducing power for carbon fixation reactions",
                color: "from-purple-500 to-indigo-500",
                icon: "🔋"
              },
              { 
                term: "Carbon Fixation", 
                definition: "Process of converting atmospheric CO₂ into organic compounds like glucose",
                color: "from-pink-500 to-rose-500",
                icon: "🌱"
              },
            ].map((concept, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/60 hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${concept.color} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <span className="text-xl md:text-2xl">{concept.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2 text-lg md:text-xl">{concept.term}</h4>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">{concept.definition}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Completion Badge - More Responsive */}
        {currentSection === sections.length - 1 && (
          <div className="mt-8 md:mt-12 text-center animate-fadeInUp">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 md:gap-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-amber-200/50 shadow-xl">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg flex-shrink-0">
                <Award className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">🎉 Congratulations!</h3>
                <p className="text-sm md:text-base lg:text-lg text-gray-600">You've completed the Photosynthesis lesson with excellence</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}