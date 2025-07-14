'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, Mic, X, Loader2, MessageCircle, Zap, Brain, Sparkles, Target, Calendar, Bookmark, TrendingUp, Clock, Globe, Shield, BookOpen, Lightbulb, Star, Heart, Coffee, Settings, Users, Search, Award } from 'lucide-react';
import { PromptChain } from './promptchaining';
import type { GeneratedSection } from '../types/api';

interface MessageInputProps {
  onSendMessage: (content: string, response?: string) => void;
  onNewGeneratedContent?: (sections: GeneratedSection[]) => void;
  onGeneratingStateChange?: (generating: boolean) => void;
  onChainUpdate?: (chain: PromptChain) => void;
}

export default function MessageInput({ 
  onSendMessage, 
  onNewGeneratedContent, 
  onGeneratingStateChange,
  onChainUpdate
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSmartFeatures, setShowSmartFeatures] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 60)}px`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    onGeneratingStateChange?.(true);

    try {
      const trimmedMessage = message.trim();
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Send message
      onSendMessage(trimmedMessage);

      // Simulate AI response time
      await new Promise(resolve => setTimeout(resolve, 1000));

             // Add mock generated content
       if (onNewGeneratedContent) {
         const mockSections: GeneratedSection[] = [
           {
             id: Date.now().toString(),
             title: 'AI Response',
             prompt: trimmedMessage,
             content: `This is a response to your message: "${trimmedMessage}". The AI has generated relevant content based on your query.`,
             timestamp: new Date(),
             chainDepth: 0,
             isChained: false
           }
         ];
         onNewGeneratedContent(mockSections);
       }

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
      onGeneratingStateChange?.(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestions = [
    { text: "Explain photosynthesis", icon: Lightbulb },
    { text: "What is DNA?", icon: BookOpen },
    { text: "How do cells work?", icon: Search },
    { text: "Cellular respiration", icon: Zap },
  ];

  const smartFeatures = [
    { icon: Brain, label: "Smart Analysis", description: "AI-powered insights" },
    { icon: Target, label: "Focus Mode", description: "Concentrated learning" },
    { icon: Star, label: "Highlights", description: "Key points extraction" },
    { icon: Coffee, label: "Study Break", description: "Relaxed conversation" },
  ];

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="relative">
      {/* Smart Features Panel */}
      {showSmartFeatures && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gradient-to-r from-white/20 via-white/10 to-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-2 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold text-white/80">Smart Features</h4>
            <button
              onClick={() => setShowSmartFeatures(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {smartFeatures.map((feature, index) => (
              <button
                key={index}
                className="flex items-center gap-1.5 p-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-xs text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
              >
                <feature.icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="font-medium">{feature.label}</p>
                  <p className="text-xs opacity-70">{feature.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions Panel */}
      {showSuggestions && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gradient-to-r from-white/20 via-white/10 to-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-2 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold text-white/80">Suggestions</h4>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setMessage(suggestion.text);
                  setShowSuggestions(false);
                }}
                className="w-full flex items-center gap-2 p-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-xs text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
              >
                <suggestion.icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                <span>{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 p-2 bg-gradient-to-r from-white/10 via-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg">
          {/* Main Input Container */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about the lesson..."
              className="w-full bg-transparent text-white placeholder-white/50 text-xs resize-none border-none outline-none pr-20 py-1 min-h-[24px] max-h-[60px] leading-tight"
              rows={1}
              disabled={loading}
            />
            
            {/* Action Buttons */}
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5">
              <button
                type="button"
                className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
                title="Attach file"
              >
                <Paperclip className="w-3 h-3" />
              </button>
              <button
                type="button"
                className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
                title="Add image"
              >
                <Image className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-1 rounded transition-all duration-200 ${
                  isRecording 
                    ? 'text-red-400 bg-red-500/20 animate-pulse' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title={isRecording ? "Stop recording" : "Voice message"}
              >
                <Mic className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className={`p-1.5 rounded-xl transition-all duration-300 shadow-lg ${
              message.trim() && !loading
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-xl'
                : 'glass backdrop-blur-sm border border-white/20 text-white/40 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg text-xs text-red-200">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
            <span>Recording...</span>
          </div>
        )}

        {/* Enhanced Feature Buttons */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg text-xs text-blue-200 hover:text-blue-100 hover:bg-blue-500/30 transition-all duration-300 hover:scale-105"
              title="Show suggestions"
            >
              <Lightbulb className="w-3 h-3" />
              <span>Suggestions</span>
            </button>
            
            <button
              type="button"
              onClick={() => setShowSmartFeatures(!showSmartFeatures)}
              className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg text-xs text-purple-200 hover:text-purple-100 hover:bg-purple-500/30 transition-all duration-300 hover:scale-105"
              title="Smart features"
            >
              <Brain className="w-3 h-3" />
              <span>Smart</span>
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-1">
            {loading && (
              <div className="flex items-center gap-1 text-xs text-white/60">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 text-xs text-white/50">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Ready</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}