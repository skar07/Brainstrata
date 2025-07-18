'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, Mic, Loader2 } from 'lucide-react';
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
  // Removed suggestions and smart features state

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

  // Removed suggestions and smart features arrays

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="relative">
      {/* Enhanced Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-1 p-2 bg-slate-800/70 backdrop-blur-lg border border-slate-600/50 rounded-2xl shadow-xl hover:border-slate-500/50 transition-all duration-300">
          {/* Main Input Container */}
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type..."
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm resize-none border-none outline-none py-2 px-2 min-h-[30px] max-h-[100px] leading-relaxed scrollbar-hide"
              rows={1}
              disabled={loading}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              title="Attach file"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              title="Add image"
            >
              <Image className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                isRecording 
                  ? 'text-red-400 bg-red-500/20 animate-pulse' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              title={isRecording ? "Stop recording" : "Voice message"}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 shadow-lg min-h-[38px] min-w-[38px] ${
              message.trim() && !loading
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
                : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
            }`}
            title="Send message"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl text-sm text-red-200 shadow-lg">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span>Recording...</span>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center mt-3">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}