'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import type { GenerateResponse, GeneratedSection } from '../types/api';
import { PromptChain, TreeNode } from './promptchaining';

interface MessageInputProps {
  onSendMessage: (message: string, response?: string) => void;
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
  const promptChainRef = useRef(new PromptChain(5)); // Max 5 prompts in context window

  const generateSectionTitles = (originalPrompt: string): string[] => {
    return [
      `Basic Overview: `,
      `How it Works: `,
      `Practical Examples: `,
      `Scientific Deep-Dive: `
    ];
  };

  const buildContextFromChain = (): string => {
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
      // Send original prompt and context separately to API
      const context = buildContextFromChain();

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ 
          prompt: userPrompt,  // Send original prompt, let API handle contextual building
          context: context,
          isChained: promptChainRef.current.getCurrentDepth() > 0
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(await res.text());
      const data: GenerateResponse = await res.json();
      
      // Add the prompt and response to our chain
      const chainNode = promptChainRef.current.addPrompt(userPrompt, data.text);
      
      // Notify parent component about chain update
      onChainUpdate?.(promptChainRef.current);
      
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
          chainDepth: promptChainRef.current.getCurrentDepth(),
          isChained: promptChainRef.current.getCurrentDepth() > 1
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

  const canContinueChain = promptChainRef.current.canAddMore();
  const chainDepth = promptChainRef.current.getCurrentDepth();

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
      {/* Chain Status Indicator */}
      {chainDepth > 0 && (
        <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700">
              🔗 Chain Mode: {chainDepth}/5 prompts
            </span>
            <span className="text-blue-600">
              {canContinueChain ? "Context maintained" : "Chain limit reached"}
            </span>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              chainDepth > 0 
                ? "Continue the conversation with context..." 
                : "Ask me anything about any topic..."
            }
            className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={!message.trim() || loading}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  );
}