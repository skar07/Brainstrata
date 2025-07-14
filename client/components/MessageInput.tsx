'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Mic, Image } from 'lucide-react';
import type { GenerateResponse, GeneratedSection } from '../types/api';
import { PromptChain } from './promptchaining';

interface MessageInputProps {
  onSendMessage: (message: string, response?: string) => void;
  onNewGeneratedContent?: (sections: GeneratedSection[]) => void;
  onGeneratingStateChange?: (generating: boolean) => void;
  onChainUpdate?: (chain: PromptChain) => void;
  onPromptUpdate?: (prompt: string) => void;
}

export default function MessageInput({ 
  onSendMessage, 
  onNewGeneratedContent, 
  onGeneratingStateChange,
  onChainUpdate,
  onPromptUpdate
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const promptChainRef = useRef<PromptChain | null>(null);

  // Initialize prompt chain
  if (!promptChainRef.current) {
    promptChainRef.current = new PromptChain(5);
  }

  const generateSectionTitles = (originalPrompt: string): string[] => {
    return [
      `Understanding ${originalPrompt.split(' ').slice(0, 3).join(' ')}`,
      `Key Concepts of ${originalPrompt.split(' ').slice(0, 2).join(' ')}`,
      `Practical Applications`,
      `Common Questions About ${originalPrompt.split(' ').slice(0, 2).join(' ')}`,
      `Advanced Insights`
    ];
  };

  const buildContextFromChain = (): string => {
    if (!promptChainRef.current) return '';
    
    const chainHistory = promptChainRef.current.getChainHistory();
    if (chainHistory.length === 0) return '';

    // Build simple context from last response only
    const lastResponse = promptChainRef.current.getLastResponse();
    if (lastResponse && lastResponse.trim()) {
      // Take only the first sentence or 50 characters, whichever is shorter
      const shortContext = lastResponse.split('.')[0].substring(0, 50).trim();
      return shortContext;
    }
    return '';
  };

  const generateContextualPrompt = (currentPrompt: string): string => {
    if (!promptChainRef.current) return currentPrompt;
    
    const chainHistory = promptChainRef.current.getChainHistory();

    if (chainHistory.length === 0) {
      return currentPrompt;
    }

    // Get the last response for simple context
    const context = buildContextFromChain();

    if (context) {
      // Create a simple contextual prompt
      return `Previous context: ${context}. Now explain: ${currentPrompt}`;
    }

    return currentPrompt;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userPrompt = message.trim();
    setLoading(true);
    setMessage('');

    // Notify that generation is starting
    onGeneratingStateChange?.(true);

    // First, send the user message to chatbot
    onSendMessage(userPrompt);

    try {
      // Update the current prompt for quiz generation
      onPromptUpdate?.(userPrompt);
      
      // Send original prompt and context separately to API
      const context = buildContextFromChain();

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ 
          prompt: userPrompt,  // Send original prompt, let API handle contextual building
          context: context,
          isChained: promptChainRef.current ? promptChainRef.current.getCurrentDepth() > 0 : false
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(await res.text());
      const data: GenerateResponse = await res.json();

      // Add the prompt and response to our chain
      if (promptChainRef.current) {
        const chainNode = promptChainRef.current.addPrompt(userPrompt, data.text);

        // Notify parent component about chain update
        onChainUpdate?.(promptChainRef.current);
      }

      // Send the simple response back to chatbot for backward compatibility
      onSendMessage(userPrompt, data.text);

      // If we have multiple responses, create sections for GeneratedContent
      if (data.responses && data.responses.length > 0 && onNewGeneratedContent) {
        const sectionTitles = generateSectionTitles(userPrompt);

        const generatedSections: GeneratedSection[] = data.responses.map((response, index) => ({
          id: `section-${Date.now()}-${index}`,
          title: sectionTitles[index] || `Response ${index + 1}`,
          prompt: response.prompt,
          content: response.response,
          timestamp: new Date(),
          chainDepth: promptChainRef.current ? promptChainRef.current.getCurrentDepth() : 0,
          isChained: promptChainRef.current ? promptChainRef.current.getCurrentDepth() > 1 : false
        }));

        onNewGeneratedContent(generatedSections);
      }
    } catch (err) {
      console.error('API Error:', err);
      // Send error message back to chatbot
      onSendMessage(userPrompt, "I'm sorry, I encountered an error while processing your request. Please try again.");
    } finally {
      setLoading(false);
      onGeneratingStateChange?.(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Add voice recording logic here
  };

  const canContinueChain = promptChainRef.current ? promptChainRef.current.canAddMore() : true;
  const chainDepth = promptChainRef.current ? promptChainRef.current.getCurrentDepth() : 0;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-3">
        {/* Input Container */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              chainDepth > 0 
                ? "Continue the conversation with context..." 
                : "Ask me anything about the lesson..."
            }
            rows={1}
            className="w-full px-3 py-2 pr-16 glass backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-white placeholder-white/60 resize-none text-xs leading-relaxed"
            style={{ minHeight: '32px', maxHeight: '80px' }}
            disabled={loading}
          />
          
          {/* Input Actions */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5">
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
          className={`p-2 rounded-xl transition-all duration-300 shadow-lg ${
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
        <div className="absolute -top-8 left-0 right-0 flex items-center justify-center">
          <div className="glass backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-xs">Recording...</span>
            </div>
          </div>
        </div>
      )}

      {/* Character Counter */}
      {message.length > 0 && (
        <div className="absolute -top-5 right-0">
          <span className={`text-xs ${
            message.length > 500 ? 'text-red-400' : 'text-white/60'
          }`}>
            {message.length}/1000
          </span>
        </div>
      )}
    </form>
  );
}