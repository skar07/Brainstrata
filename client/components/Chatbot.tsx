'use client';

import { useState, useEffect, useRef } from 'react';
import MessageInput from './MessageInput';
import { Bot, User, ChevronLeft, Copy, ThumbsUp, ThumbsDown, Sparkles, MessageCircle, Zap, Star, Brain, Lightbulb, Target, Coffee } from 'lucide-react';
import type { GeneratedSection } from '../types/api';
import { PromptChain } from './promptchaining';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  isChained?: boolean;
}

interface ChatbotProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  onNewGeneratedContent?: (sections: GeneratedSection[]) => void;
  onGeneratingStateChange?: (generating: boolean) => void;
  onChainUpdate?: (chain: PromptChain) => void;
  onPromptUpdate?: (prompt: string) => void;
}

// Consistent timestamp formatting function
const formatTimestamp = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const minuteStr = minutes.toString().padStart(2, '0');
  return `${hour12}:${minuteStr} ${ampm}`;
};

// Client-side only timestamp component
const Timestamp = ({ timestamp }: { timestamp: Date }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder that matches the expected format during SSR
    return <span className="text-xs opacity-70 mt-2 block">--:-- --</span>;
  }

  return (
    <span className="text-xs opacity-70 mt-2 block">
      {formatTimestamp(timestamp)}
    </span>
  );
};

export default function Chatbot({ 
  isCollapsed: externalIsCollapsed, 
  setIsCollapsed: externalSetIsCollapsed,
  onNewGeneratedContent,
  onGeneratingStateChange,
  onChainUpdate,
  onPromptUpdate
}: ChatbotProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI learning assistant. I can help you understand concepts, answer questions, and provide additional explanations about the lesson. What would you like to know about photosynthesis?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const promptChainRef = useRef<PromptChain | null>(null);
  
  const isCollapsed = externalIsCollapsed ?? internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed ?? setInternalIsCollapsed;

  // Initialize prompt chain
  useEffect(() => {
    if (!promptChainRef.current) {
      promptChainRef.current = new PromptChain(5);
      onChainUpdate?.(promptChainRef.current);
    }
  }, [onChainUpdate]);

  const handleSendMessage = (content: string, response?: string) => {
    if (!response) {
      // First call - just the user message
      const isChainedMessage = promptChainRef.current ? promptChainRef.current.getCurrentDepth() > 0 : false;
      
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        isBot: false,
        timestamp: new Date(),
        isChained: isChainedMessage,
      };

      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      onGeneratingStateChange?.(true);

      // Add to prompt chain
      if (promptChainRef.current) {
        promptChainRef.current.addPrompt(content);
        onChainUpdate?.(promptChainRef.current);
      }

      // Simulate AI response
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateResponse(content),
          isBot: true,
          timestamp: new Date(),
          isChained: promptChainRef.current ? promptChainRef.current.getCurrentDepth() > 1 : false,
        };

        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        onGeneratingStateChange?.(false);

        // Update chain with response
        if (promptChainRef.current) {
          // The response is already handled in the addPrompt method
          onChainUpdate?.(promptChainRef.current);
        }
      }, 1500);
    } else {
      // Second call - add the AI response
      const isChainedResponse = promptChainRef.current ? promptChainRef.current.getCurrentDepth() > 1 : false;
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isBot: true,
        timestamp: new Date(),
        isChained: isChainedResponse,
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      onGeneratingStateChange?.(false);

      // Update chain with response
      if (promptChainRef.current) {
        // The response is already handled in the addPrompt method
        onChainUpdate?.(promptChainRef.current);
      }
    }
  };

  const generateResponse = (input: string): string => {
    const responses = [
      "Great question! Let me explain that concept in detail. Photosynthesis is a fascinating process that involves multiple stages working together to convert light energy into chemical energy.",
      "That's an excellent observation! The process you're asking about is fundamental to understanding how plants create energy. Here's what happens...",
      "I'm glad you asked! This is one of the most important concepts in biology. Let me break it down for you step by step.",
      "Interesting question! The answer involves understanding the molecular mechanisms that make life possible. Here's a comprehensive explanation...",
      "Perfect timing for this question! What you're asking about connects to several other important biological processes. Let me explain...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleChainUpdate = (chain: PromptChain) => {
    promptChainRef.current = chain;
    onChainUpdate?.(chain);
  };

  const resetChain = () => {
    promptChainRef.current = new PromptChain(5);
    onChainUpdate?.(promptChainRef.current);
    
    // Add a system message about chain reset
    const resetMessage: Message = {
      id: Date.now().toString(),
      content: "🔄 Conversation context has been reset. Starting fresh conversation.",
      isBot: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, resetMessage]);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const quickQuestions = [
    { text: "What is chlorophyll?", icon: Lightbulb },
    { text: "How does ATP work?", icon: Zap },
    { text: "Calvin cycle steps?", icon: Target },
    { text: "Light reactions?", icon: Star },
  ];

  const aiFeatures = [
    { icon: Brain, label: "Smart Analysis", description: "Deep concept understanding" },
    { icon: MessageCircle, label: "Instant Help", description: "24/7 learning support" },
    { icon: Coffee, label: "Study Buddy", description: "Personalized assistance" },
  ];

  const currentChainDepth = promptChainRef.current?.getCurrentDepth() || 0;

  return (
    <div 
      className={`bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-64'} h-screen max-h-screen relative shadow-2xl border-l border-white/20`}
      onClick={(e) => e.stopPropagation()}
      style={{ overflow: 'visible' }}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden rounded-l-2xl">
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-6 text-white/10 animate-float">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute bottom-40 left-6 text-white/10 animate-float animation-delay-2000">
          <Star className="w-3 h-3" />
        </div>
      </div>

      {/* Enhanced Arrow Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsCollapsed(!isCollapsed);
        }}
        className={`fixed top-1/2 transform -translate-y-1/2 z-50 w-7 h-10 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-700 shadow-2xl hover:shadow-purple-500/70 transition-all duration-300 flex items-center justify-center group border-2 border-white/60 hover:scale-110 animate-pulse rounded-l-xl ${
          isCollapsed 
            ? 'right-8' 
            : 'right-64'
        }`}
        title={isCollapsed ? "Expand AI Assistant" : "Collapse AI Assistant"}
        style={{ zIndex: 9999 }}
      >
        <ChevronLeft className={`w-3 h-3 text-white drop-shadow-2xl transition-all duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} />
        <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl"></div>
        {/* Extra visibility indicator */}
        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping"></div>
      </button>

      {/* Enhanced Header - Fixed */}
      <div className={`flex-shrink-0 p-4 border-b border-white/20 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-violet-500/20 backdrop-blur-sm relative z-10 ${isCollapsed ? 'px-3' : ''}`}>
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
            <Bot className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-sm font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                AI Assistant
              </h2>
              <p className="text-xs text-white/60 font-medium">Always here to help</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Features Preview - Fixed */}
      {!isCollapsed && (
        <div className="flex-shrink-0 p-3 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 relative z-10">
          <div className="grid grid-cols-3 gap-1.5">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="text-center p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <feature.icon className="w-3 h-3 text-white/70 mx-auto mb-1 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                <p className="text-xs text-white/60 font-medium">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isCollapsed && (
        <>
          {/* Enhanced Messages - Scrollable Container */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-white/10">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'} animate-fadeInUp`}
              >
                {message.isBot && (
                  <div 
                    className="w-7 h-7 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0 cursor-default shadow-lg animate-pulse"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-xl relative group transition-all duration-300 ${
                    message.isBot
                      ? 'bg-gradient-to-br from-white/20 via-white/10 to-white/20 backdrop-blur-sm text-white border border-white/30 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                  }`}
                >
                  <p className="text-xs leading-relaxed">{message.content}</p>
                  <Timestamp timestamp={message.timestamp} />

                  {message.isBot && (
                    <div className="absolute -right-1.5 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-0.5 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-lg p-0.5 shadow-lg border border-white/30">
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="p-0.5 hover:bg-white/30 rounded text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                          title="Copy message"
                        >
                          <Copy className="w-2.5 h-2.5" />
                        </button>
                        <button 
                          className="p-0.5 hover:bg-white/30 rounded text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                          title="Like message"
                        >
                          <ThumbsUp className="w-2.5 h-2.5" />
                        </button>
                        <button 
                          className="p-0.5 hover:bg-white/30 rounded text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                          title="Dislike message"
                        >
                          <ThumbsDown className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!message.isBot && (
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Enhanced Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start animate-fadeInUp">
                <div className="w-7 h-7 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Quick Questions - Fixed */}
          <div className="flex-shrink-0 p-3 border-t border-white/20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-violet-500/10 backdrop-blur-sm relative z-10">
            <p className="text-xs text-white/70 mb-2 font-semibold">Quick Questions</p>
            <div className="grid grid-cols-2 gap-1.5">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question.text)}
                  className="flex items-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-xs text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
                >
                  <question.icon className="w-2.5 h-2.5 group-hover:scale-110 transition-transform" />
                  <span className="truncate">{question.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Message Input - Fixed */}
          <div className="flex-shrink-0 p-3 border-t border-white/20 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm relative z-10">
            <MessageInput 
              onSendMessage={handleSendMessage}
              onNewGeneratedContent={onNewGeneratedContent}
              onGeneratingStateChange={onGeneratingStateChange}
              onChainUpdate={handleChainUpdate}
            />
          </div>
        </>
      )}

      {/* Collapsed State Content */}
      {isCollapsed && (
        <div className="flex flex-col items-center justify-center flex-1 p-3 relative z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse mb-3">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-center">
            <p className="text-white/60 text-xs font-medium mb-1.5">AI Chat</p>
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Notification badge */}
          <div className="absolute top-3 right-3 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold">{messages.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}