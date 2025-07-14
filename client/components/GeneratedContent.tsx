'use client';

import { useState } from 'react';
import React from 'react';
import VisualBlock from './VisualBlock';
import { ChevronRight, BookOpen, Lightbulb, CheckCircle, FileText, Brain, Search, Microscope, Loader2, Link, TrendingUp, MessageSquare } from 'lucide-react';
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
        : 0
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
    <div className="h-full w-full bg-gray-50 overflow-y-auto">
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
            {hasChainedContent && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-purple-600 font-medium flex items-center gap-1">
                  <Link className="w-3 h-3" />
                  Chained
                </span>
              </>
            )}
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isDynamicContent ? "AI Generated Learning Content" : "Understanding Photosynthesis"}
          </h1>
          <p className="text-xl text-gray-600">
            {isDynamicContent 
              ? hasChainedContent 
                ? "Explore contextual AI responses built upon previous conversation"
                : "Explore different perspectives and explanations generated by AI"
              : "Explore how plants convert sunlight into energy through this interactive lesson."
            }
          </p>
        </div>

        {/* Chain Status Panel */}
        {hasChainedContent && chainHistory.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-sm border border-purple-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Link className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Prompt Chain Active</h3>
                  <p className="text-sm text-gray-600">
                    {chainHistory.length}/5 context prompts • Chain depth: {maxChainDepth}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleChainHistory}
                className="px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
              >
                {showChainHistory ? 'Hide' : 'Show'} Chain History
              </button>
            </div>
            
            {/* Chain Visualization */}
            <div className="flex items-center gap-2 mb-4">
              {chainHistory.map((_, index) => (
                <React.Fragment key={index}>
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  {index < chainHistory.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  )}
                </React.Fragment>
              ))}
              {chainHistory.length < 5 && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">
                    +
                  </div>
                </>
              )}
            </div>

            {/* Chain History Details */}
            {showChainHistory && (
              <div className="space-y-3 pt-4 border-t border-purple-200">
                {chainHistory.map((node, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium text-purple-700">
                            Prompt {index + 1}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatChainTimestamp(node.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Q:</strong> {node.prompt}
                        </p>
                        {node.response && (
                          <p className="text-sm text-gray-600">
                            <strong>A:</strong> {truncateChainResponse(node.response)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Generating Content...</h3>
                <p className="text-gray-600">
                  {hasChainedContent 
                    ? "Creating contextual AI response based on conversation history."
                    : "Creating multiple AI responses for your query."
                  }
                </p>
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
                className={`h-2 rounded-full transition-all duration-300 ${
                  hasChainedContent 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}
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

        {/* Content Sections */}
        <div className="space-y-8">
          {displaySections.map((section, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isDynamicContent ? 'opacity-100' : (isSectionAccessible(index) ? 'opacity-100' : 'opacity-50')
              }`}
            >
              <div className={`bg-white rounded-xl shadow-sm border p-6 ${
                isDynamicContent && isSectionChained(section as GeneratedSection)
                  ? 'border-purple-200 bg-gradient-to-br from-purple-50/30 to-blue-50/30' 
                  : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isDynamicContent && isSectionChained(section as GeneratedSection)
                      ? 'bg-gradient-to-br from-purple-500 to-blue-600'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    {(() => {
                      const IconComponent = getIconForSection(index, isDynamicContent);
                      return <IconComponent className="w-5 h-5 text-white" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                      {isDynamicContent && isSectionChained(section as GeneratedSection) && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          <Link className="w-3 h-3" />
                          Contextual
                        </div>
                      )}
                    </div>
                    {isDynamicContent && getChainDepth(section as GeneratedSection) > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <TrendingUp className="w-3 h-3" />
                        Chain depth: {getChainDepth(section as GeneratedSection)}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">{section.content}</p>

                {!isDynamicContent && index === currentSection && !isGenerating && (
                  <button
                    onClick={() => handleSectionInteraction(index, 'complete')}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    {index === displaySections.length - 1 ? 'Complete Lesson' : 'Continue'}
                  </button>
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