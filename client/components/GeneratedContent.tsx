'use client';

import { useState } from 'react';
import React from 'react';
import VisualBlock from './VisualBlock';
import { ChevronRight, BookOpen, Lightbulb, CheckCircle, FileText, Brain, Search, Microscope, Loader2, Link, TrendingUp, MessageSquare, Image, MessageCircle } from 'lucide-react';
import type { GeneratedSection } from '../types/api';
import { PromptChain } from './promptchaining';
import Lottie from 'lottie-react';
import animationData from '../assets/Robot_says_hello.json';
import ContentFormatter from './ContentFormatter';
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
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({});

  // Icons for different types of responses
  const responseIcons = [FileText, Brain, Search, Microscope];

  // Function to get icon for a section
  const getIconForSection = (index: number) => {
    return responseIcons[index % responseIcons.length];
  };

  const isDynamicContent = sections.length > 0;
  const hasChainedContent = sections.some(section => section.isChained);
  const maxChainDepth = Math.max(...sections.map(section => section.chainDepth || 0), 0);

  // Get chain history if available
  const chainHistory = promptChain?.getChainHistory() || [];

  // Function to handle image loading state
  const handleImageLoad = (sectionId: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [sectionId]: false
    }));
  };

  // Function to handle image error
  const handleImageError = (sectionId: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [sectionId]: false
    }));
  };

  // Function to check if image is loading
  const isImageLoading = (sectionId: string) => {
    return imageLoadingStates[sectionId] !== false;
  };

  // Effect to set initial loading states when sections are added
  React.useEffect(() => {
    const newLoadingStates: { [key: string]: boolean } = {};
    sections.forEach((section, index) => {
      if (section.imageUrl) {
        newLoadingStates[`section-${index}`] = true;
      }
    });
    setImageLoadingStates(prev => ({
      ...prev,
      ...newLoadingStates
    }));
  }, [sections]);

  // Function to handle section progression
  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
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
    if (index >= 0 && index < sections.length) {
      setCurrentSection(index);
    }
  };

  // Function to reset progress
  const resetProgress = () => {
    setCurrentSection(0);
  };

  // Function to get section status
  const getSectionStatus = (index: number) => {
    return 'completed';
  };

  // Function to calculate progress percentage
  const getProgressPercentage = () => {
    return sections.length > 0 ? 100 : 0;
  };

  // Function to get current section data
  const getCurrentSectionData = () => {
    return sections[currentSection];
  };

  // Function to check if lesson is complete
  const isLessonComplete = () => {
    return sections.length > 0;
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
      totalSections: 0,
      completedSections: 0,
      remainingSections: 0,
      completionStatus: 'empty'
    };
  };

  // If no content is generated yet, show the default prompt message
  if (!isDynamicContent && !isGenerating) {
    return (
      <div className="h-full w-full bg-gray-50">
        {/* Full-width responsive header */}
        <div className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg md:text-xl font-bold text-white">AI Learning Assistant</h1>
                  <p className="text-sm text-blue-100">Ready to generate content</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
               
               
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex items-center justify-center flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-8">
                {/* Lottie Animation */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40">
                    <Lottie 
                      animationData={animationData} 
                      loop={true} 
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
                
                {/* Content Text */}
                <div className="flex-1 text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Ready to Generate Content
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    Write a prompt in the chatbot and the generated content will appear here.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Tip:</strong> Try asking questions about any topic, and AI will create interactive learning content for you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-50">
      {/* Full-width responsive header */}
      <div className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-white">AI Learning Assistant</h1>
                <p className="text-sm text-blue-100">
                  {isGenerating ? 'Generating content...' : `${sections.length} responses generated`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block w-16 h-16">
                <Lottie 
                  animationData={animationData} 
                  loop={true} 
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className="md:hidden w-12 h-12">
                <Lottie 
                  animationData={animationData} 
                  loop={true} 
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="overflow-y-auto flex-1">
        <div className="max-w-4xl mx-auto p-8 pb-16">
          {/* Header */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <span>AI Learning</span>
              <ChevronRight className="w-4 h-4" />
              <span>Generated Content</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-blue-600 font-medium">
                AI Responses
              </span>
            </nav>
            <div className="flex items-center gap-6">
              {/* Lottie Animation */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24">
                  <Lottie 
                    animationData={animationData} 
                    loop={true} 
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
              
              {/* Content Text */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  AI Generated Learning Content
                </h1>
                <p className="text-xl text-gray-600">
                  Explore different perspectives and explanations generated by AI
                </p>
              </div>
            </div>
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
          {sections.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Generated Responses
                </span>
                <span className="text-sm text-gray-600">
                  {sections.length} responses completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

          {/* Content Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className="transition-all duration-700 animate-streamIn opacity-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      {(() => {
                        const IconComponent = getIconForSection(index);
                        return <IconComponent className="w-5 h-5 text-white" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-1">{section.title}</h2>
                    </div>
                  </div>
                  {/* Professional Content Formatting */}
                  <div className="mb-6">
                    <ContentFormatter 
                      content={
                        typeof section.content === 'string' 
                          ? section.content 
                          : Array.isArray(section.content) 
                            ? (section.content as string[]).join('\n') 
                            : ''
                      } 
                      className="text-gray-800 leading-relaxed"
                    />
                  </div>
                  
                  {/* Display generated image if available */}
                  {section.imageUrl && (
                    <div className="mb-6 animate-imageFadeIn">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Image className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium text-purple-700">AI Generated Image   <button
                              onClick={() => window.open(section.imageUrl, '_blank')}
                              className="px-3 py-1 bg-white/90 text-gray-800 rounded-lg text-sm font-medium hover:bg-white transition-all duration-200"
                            >
                              View Full Size
                            </button></span>
                        </div>
                        <div className="relative group">
                          <img 
                            src={section.imageUrl} 
                            alt={`AI generated image for: ${section.title}`}
                            className="w-full h-auto rounded-lg shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300"
                            onLoad={() => handleImageLoad(`section-${index}`)}
                            onError={() => handleImageError(`section-${index}`)}
                            style={{ 
                              opacity: isImageLoading(`section-${index}`) ? 0 : 1, 
                              transition: 'opacity 0.3s ease-in-out' 
                            }}
                          />
                          {/* Loading skeleton - only show when image is loading */}
                          {isImageLoading(`section-${index}`) && (
                            <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                                <span className="text-sm text-gray-500">Loading image...</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Placeholder Sections */}
            {isGenerating && getLoadingSections().map((loadingSection, index) => (
              <div
                key={loadingSection.id}
                className="transition-all duration-700 opacity-100 animate-streamPulse"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold text-gray-300">{loadingSection.title}</h2>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                        <span>Generating...</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Visual Blocks - More Responsive */}
          {sections.length > 0 && (
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
                  title="Interactive Diagram" 
                  interactive={true}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <VisualBlock 
                    type="grid" 
                    title="Data Grid" 
                    interactive={true}
                  />
                  <VisualBlock 
                    type="flowchart" 
                    title="Process Flow" 
                    interactive={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}