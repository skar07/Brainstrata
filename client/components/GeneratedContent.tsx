'use client';

import { useState, useRef } from 'react';
import React from 'react';
import VisualBlock from './VisualBlock';
import { ChevronRight, BookOpen, Lightbulb, CheckCircle, FileText, Brain, Search, Microscope, Loader2, Link, TrendingUp, MessageSquare, Image } from 'lucide-react';
import type { GeneratedSection } from '../types/api';
import { PromptChain } from './promptchaining';

interface GeneratedContentProps {
  sections?: GeneratedSection[];
  isGenerating?: boolean;
  promptChain?: PromptChain;
}

export default function GeneratedContent({ 
  sections = [], 
  isGenerating = false,
  promptChain
}: GeneratedContentProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showChainHistory, setShowChainHistory] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Default static sections for when no dynamic content is provided
  const defaultSections = [
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

  // Icons for different types of responses
  const responseIcons = [FileText, Brain, Search, Microscope];

  // Function to get icon for a section
  const getIconForSection = (index: number, isDynamic: boolean) => {
    if (isDynamic) {
      return responseIcons[index % responseIcons.length];
    }
    return defaultSections[index]?.icon || BookOpen;
  };

  const isDynamicContent = sections.length > 0;
  const displaySections = isDynamicContent ? sections : defaultSections;
  const hasChainedContent = sections.some(section => section.isChained);
  const maxChainDepth = Math.max(...sections.map(section => section.chainDepth || 0), 0);

  // Get chain history if available
  const chainHistory = promptChain?.getChainHistory() || [];

  // Navigation functions
  const goToNextCard = () => {
    if (currentCardIndex < displaySections.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const goToCard = (index: number) => {
    if (index >= 0 && index < displaySections.length) {
      setCurrentCardIndex(index);
    }
  };

  // Function to handle section progression
  const handleNextSection = () => {
    if (currentSection < displaySections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  // Function to handle section regression
  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  // Function to jump to specific section
  const jumpToSection = (index: number) => {
    if (index >= 0 && index < displaySections.length) {
      setCurrentSection(index);
    }
  };

  // Function to reset progress
  const resetProgress = () => {
    setCurrentSection(0);
  };

  // Function to check if section is accessible
  const isSectionAccessible = (index: number) => {
    if (isDynamicContent) {
      return true; // All dynamic content is immediately accessible
    }
    return index <= currentSection; // Static content follows progression
  };

  // Function to get section status
  const getSectionStatus = (index: number) => {
    if (isDynamicContent) {
      return 'completed';
    }
    if (index < currentSection) {
      return 'completed';
    } else if (index === currentSection) {
      return 'current';
    } else {
      return 'locked';
    }
  };

  // Function to calculate progress percentage
  const getProgressPercentage = () => {
    if (isDynamicContent) {
      return 100; // Dynamic content is always 100% complete
    }
    return Math.round(((currentSection + 1) / displaySections.length) * 100);
  };

  // Function to get current section data
  const getCurrentSectionData = () => {
    return displaySections[currentSection];
  };

  // Function to check if lesson is complete
  const isLessonComplete = () => {
    if (isDynamicContent) {
      return sections.length > 0;
    }
    return currentSection === displaySections.length - 1;
  };

  // Function to handle chain history toggle
  const toggleChainHistory = () => {
    setShowChainHistory(!showChainHistory);
  };

  // Function to get chain depth for a section
  const getChainDepth = (section: GeneratedSection) => {
    return section.chainDepth || 0;
  };

  // Function to check if section is chained
  const isSectionChained = (section: GeneratedSection) => {
    return section.isChained || false;
  };

  // Function to get chain node data
  const getChainNodeData = (index: number) => {
    return chainHistory[index] || null;
  };

  // Function to format chain timestamp
  const formatChainTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Function to truncate chain response
  const truncateChainResponse = (response: string, maxLength: number = 150) => {
    if (response.length <= maxLength) {
      return response;
    }
    return response.substring(0, maxLength) + '...';
  };

  // Function to get chain statistics
  const getChainStats = () => {
    return {
      totalPrompts: chainHistory.length,
      maxDepth: maxChainDepth,
      averageDepth: chainHistory.length > 0 
        ? Math.round(chainHistory.reduce((sum, node) => sum + (node.depth || 0), 0) / chainHistory.length)
        : 0,
      binaryTreeDepth: promptChain ? promptChain.getBinaryTreeDepth() : 0,
      conversationPath: promptChain ? promptChain.getConversationPath().length : 0
    };
  };

  // Function to handle content generation state
  const handleGeneratingState = (generating: boolean) => {
    // This would typically be handled by the parent component
    // but we can provide a callback for internal state management
    if (!generating && isGenerating) {
      // Content generation completed
      if (isDynamicContent && sections.length > 0) {
        // Auto-advance to first section for dynamic content
        setCurrentSection(0);
      }
    }
  };

  // Function to check if section is still loading
  const isSectionLoading = (index: number) => {
    return isGenerating && index >= sections.length;
  };

  // Function to get loading placeholder sections
  const getLoadingSections = () => {
    if (!isGenerating) return [];
    
    const remainingCount = 4 - sections.length;
    return Array.from({ length: remainingCount }, (_, i) => ({
      id: `loading-${i}`,
      title: `Generating Response ${sections.length + i + 1}...`,
      content: '',
      isLoading: true,
      index: sections.length + i
    }));
  };

  // Function to validate section data
  const validateSectionData = (section: any) => {
    return section && 
           typeof section.title === 'string' && 
           typeof section.content === 'string';
  };

  // Function to get section metadata
  const getSectionMetadata = (section: any, index: number) => {
    if (isDynamicContent && validateSectionData(section)) {
      return {
        isChained: isSectionChained(section as GeneratedSection),
        chainDepth: getChainDepth(section as GeneratedSection),
        timestamp: new Date(), // Would come from actual data
        responseType: responseIcons[index % responseIcons.length].name
      };
    }
    
    // Default metadata for static sections
    return {
      isChained: false,
      chainDepth: 0,
      timestamp: new Date(),
      responseType: 'static'
    };
  };

  // Function to handle section interaction
  const handleSectionInteraction = (index: number, action: 'view' | 'complete' | 'skip') => {
    switch (action) {
      case 'view':
        jumpToSection(index);
        break;
      case 'complete':
        if (index === currentSection) {
          handleNextSection();
        }
        break;
      case 'skip':
        if (isDynamicContent) {
          jumpToSection(index);
        }
        break;
    }
  };

  // Function to get content summary
  const getContentSummary = () => {
    if (isDynamicContent) {
      return {
        totalSections: sections.length,
        chainedSections: sections.filter(s => s.isChained).length,
        averageChainDepth: getChainStats().averageDepth,
        completionStatus: 'dynamic'
      };
    }
    
    return {
      totalSections: defaultSections.length,
      completedSections: currentSection + 1,
      remainingSections: defaultSections.length - (currentSection + 1),
      completionStatus: isLessonComplete() ? 'complete' : 'in-progress'
    };
  };

  return (
    <div className="h-fit w-full bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span>AI Learning</span>
            <ChevronRight className="w-4 h-4" />
            <span>Generated Content</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium">
              {isDynamicContent ? "AI Responses" : "Photosynthesis"}
            </span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isDynamicContent ? "AI Generated Learning Content" : "Understanding Photosynthesis"}
          </h1>
          <p className="text-xl text-gray-600">
            {isDynamicContent 
              ? "Explore different perspectives and explanations generated by AI"
              : "Explore how plants convert sunlight into energy through this interactive lesson."
            }
          </p>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Generating Content...</h3>
                <p className="text-gray-600">
                  Creating multiple AI responses for your query. Responses will appear as they're ready.
                </p>
              </div>
            </div>
            
            {/* Streaming Progress Indicator */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">Generating responses...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {displaySections.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {isDynamicContent ? "Generated Responses" : "Progress"}
              </span>
              <span className="text-sm text-gray-600">
                {isDynamicContent 
                  ? `${displaySections.length} responses completed` 
                  : `${getProgressPercentage()}% complete`
                }
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600"
                style={{ 
                  width: `${isDynamicContent 
                    ? 100 
                    : getProgressPercentage()
                  }%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Content Sections - Single Card Carousel */}
        <div className="relative">
          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {displaySections.map((_, index) => (
              <button
                key={index}
                onClick={() => goToCard(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentCardIndex 
                    ? 'bg-purple-500 scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Go to ${displaySections[index].title}`}
              />
            ))}
          </div>

          {/* Single Card Display */}
          <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {displaySections.length > 0 && (
              <div className="w-full">
                {(() => {
                  const section = displaySections[currentCardIndex];
                  const nextSection = displaySections[currentCardIndex + 1];
                  const nextTopicName = nextSection ? nextSection.title : "Complete Lesson";
                  
                  return (
                    <div className="p-6">
                      {/* Card Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          {(() => {
                            const IconComponent = getIconForSection(currentCardIndex, isDynamicContent);
                            return <IconComponent className="w-5 h-5 text-white" />;
                          })()}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">
                              {currentCardIndex + 1} of {displaySections.length}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="text-gray-700 leading-relaxed mb-6 text-base">
                        {section.content}
                      </div>
                      
                      {/* Display generated image if available */}
                      {isDynamicContent && (section as GeneratedSection).imageUrl && (
                        <div className="mb-6 animate-imageFadeIn">
                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Image className="w-4 h-4 text-purple-500" />
                              <span className="text-sm font-medium text-purple-700">AI Generated Image</span>
                              <button
                                onClick={() => window.open((section as GeneratedSection).imageUrl, '_blank')}
                                className="px-3 py-1 bg-white/90 text-gray-800 rounded-lg text-sm font-medium hover:bg-white transition-all duration-200"
                              >
                                View Full Size
                              </button>
                            </div>
                            <div className="relative group">
                              <img 
                                src={(section as GeneratedSection).imageUrl} 
                                alt={`AI generated image for: ${section.title}`}
                                className="w-full h-auto rounded-lg shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {/* Back Button */}
                        <button
                          onClick={goToPreviousCard}
                          disabled={currentCardIndex === 0}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                            currentCardIndex === 0
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                          }`}
                        >
                          <span>&lt;---</span>
                          <span>{currentCardIndex > 0 ? displaySections[currentCardIndex - 1].title : 'Previous'}</span>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={() => {
                            if (!isDynamicContent) {
                              handleSectionInteraction(currentCardIndex, 'complete');
                            } else {
                              goToNextCard();
                            }
                          }}
                          className="text-purple-600 hover:text-purple-800 transition-colors font-medium text-sm flex items-center gap-2"
                        >
                          <span>{nextTopicName}</span>
                          <span>---&gt;</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Loading Placeholder for Current Card */}
            {isGenerating && getLoadingSections().length > currentCardIndex && (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-gray-300">
                        {getLoadingSections()[currentCardIndex]?.title || 'Generating...'}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                      <span>Generating content...</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Concepts - Only show for default content */}
        {!isDynamicContent && (
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
        )}
      </div>
    </div>
  );
}