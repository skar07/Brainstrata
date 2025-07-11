'use client';

import { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import type { GenerateResponse, GeneratedSection } from '../types/api';

interface MessageInputProps {
  onSendMessage: (message: string, response?: string) => void;
  onNewGeneratedContent?: (sections: GeneratedSection[]) => void;
  onGeneratingStateChange?: (generating: boolean) => void;
}

export default function MessageInput({ 
  onSendMessage, 
  onNewGeneratedContent, 
  onGeneratingStateChange
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSectionTitles = (originalPrompt: string): string[] => {
    return [
      `Basic Overview: `,
      `How it Works: `,
      `Practical Examples: `,
      `Scientific Deep-Dive: `
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const prompt = message.trim();
    setLoading(true);
    setMessage('');

    // Notify that generation is starting
    onGeneratingStateChange?.(true);

    // First, send the user message to chatbot
    onSendMessage(prompt);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(await res.text());
      const data: GenerateResponse = await res.json();
      
      // Send the response back to chatbot
      onSendMessage(prompt, data.text);

      // Create a section for the middle area with the generated content
      if (data.text && onNewGeneratedContent) {
        const generatedSections: GeneratedSection[] = [{
          id: `section-${Date.now()}`,
          title: `Generated Content: ${prompt}`,
          prompt: prompt,
          content: data.text,
          timestamp: new Date(),
          quizQuestions: data.quizQuestions || [] // Include quiz questions from API response
        }];

        onNewGeneratedContent(generatedSections);
      }
    } catch (err) {
      console.error('API Error:', err);
      // Send error message back to chatbot
      onSendMessage(prompt, "I'm sorry, I encountered an error while processing your request. Please try again.");
    } finally {
      setLoading(false);
      onGeneratingStateChange?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about any topic..."
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