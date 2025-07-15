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
}

export default function MessageInput({ 
  onSendMessage, 
  onNewGeneratedContent, 
  onGeneratingStateChange,
  onChainUpdate
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generateImage, setGenerateImage] = useState(false);
  const promptChainRef = useRef<PromptChain | null>(null);

  // Initialize prompt chain
  if (!promptChainRef.current) {
    promptChainRef.current = new PromptChain(50); // Increased from 5 to 50 for unlimited prompts
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
    
    // Use the new conversation context method
    return promptChainRef.current.getConversationContext();
  };

  const generateContextualPrompt = (currentPrompt: string): string => {
    if (!promptChainRef.current) return currentPrompt;
    
    const context = buildContextFromChain();

    if (context) {
      // Create a contextual prompt with conversation history
      return `Previous conversation context:\n${context}\n\nNow, please respond to: ${currentPrompt}`;
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
      // Get conversation context for the API
      const context = buildContextFromChain();
      const isChained = promptChainRef.current ? promptChainRef.current.getCurrentDepth() > 0 : false;

      // Use streaming mode for better UX
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ 
          prompt: userPrompt,
          context: context,
          isChained: isChained,
          generateImage: generateImage,
          streamMode: true // Enable streaming
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(await res.text());

      // Handle streaming response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponses: any[] = [];
      let simpleResponse = '';
      let imageUrl = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                switch (data.type) {
                  case 'simple':
                    simpleResponse = data.text;
                    // Send the simple response to chatbot immediately
                    onSendMessage(userPrompt, data.text);
                    break;
                    
                  case 'variation':
                    accumulatedResponses = data.allResponses;
                    // Update GeneratedContent with new responses as they come in
                    if (onNewGeneratedContent) {
                      const sectionTitles = generateSectionTitles(userPrompt);
                      const generatedSections: GeneratedSection[] = accumulatedResponses.map((response, index) => ({
                        id: `section-${Date.now()}-${index}`,
                        title: sectionTitles[index] || `Response ${index + 1}`,
                        prompt: response.prompt,
                        content: response.response,
                        timestamp: new Date(),
                        chainDepth: promptChainRef.current ? promptChainRef.current.getCurrentDepth() : 0,
                        isChained: promptChainRef.current ? promptChainRef.current.getCurrentDepth() > 1 : false,
                        imageUrl: '' // Will be updated when image is ready
                      }));
                      onNewGeneratedContent(generatedSections);
                    }
                    break;
                    
                  case 'image':
                    imageUrl = data.imageUrl;
                    // Update the first section with the image URL
                    if (onNewGeneratedContent && accumulatedResponses.length > 0) {
                      const sectionTitles = generateSectionTitles(userPrompt);
                      const generatedSections: GeneratedSection[] = accumulatedResponses.map((response, index) => ({
                        id: `section-${Date.now()}-${index}`,
                        title: sectionTitles[index] || `Response ${index + 1}`,
                        prompt: response.prompt,
                        content: response.response,
                        timestamp: new Date(),
                        chainDepth: promptChainRef.current ? promptChainRef.current.getCurrentDepth() : 0,
                        isChained: promptChainRef.current ? promptChainRef.current.getCurrentDepth() > 1 : false,
                        imageUrl: index === 0 ? imageUrl : '' // Add image URL to the first section
                      }));
                      onNewGeneratedContent(generatedSections);
                    }
                    break;
                    
                  case 'complete':
                    // Final update with complete data
                    if (onNewGeneratedContent) {
                      const sectionTitles = generateSectionTitles(userPrompt);
                      const generatedSections: GeneratedSection[] = data.responses.map((response: any, index: number) => ({
                        id: `section-${Date.now()}-${index}`,
                        title: sectionTitles[index] || `Response ${index + 1}`,
                        prompt: response.prompt,
                        content: response.response,
                        timestamp: new Date(),
                        chainDepth: promptChainRef.current ? promptChainRef.current.getCurrentDepth() : 0,
                        isChained: promptChainRef.current ? promptChainRef.current.getCurrentDepth() > 1 : false,
                        imageUrl: index === 0 ? data.imageUrl : '' // Add image URL to the first section
                      }));
                      onNewGeneratedContent(generatedSections);
                    }
                    break;
                }
              } catch (parseError) {
                console.error('Error parsing streaming data:', parseError);
              }
            }
          }
        }
      }

      // Update the chain with the response
      if (promptChainRef.current) {
        // Update the last node with the response
        const chainHistory = promptChainRef.current.getChainHistory();
        const lastNode = chainHistory[chainHistory.length - 1];
        if (lastNode) {
          lastNode.response = simpleResponse;
        }
        
        // Notify parent component about chain update
        onChainUpdate?.(promptChainRef.current);
      }

    } catch (err) {
      console.error('API Error:', err);
      // Send error message back to chatbot
      onSendMessage(userPrompt, "I'm sorry, I encountered an error while processing your request. Please try again.");
    } finally {
      setLoading(false);
      onGeneratingStateChange?.(false);
      setGenerateImage(false); // Reset image generation flag
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
              onClick={() => setGenerateImage(!generateImage)}
              className={`p-1 rounded transition-all duration-200 ${
                generateImage 
                  ? 'text-purple-400 bg-purple-500/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={generateImage ? "Disable image generation" : "Generate image with response"}
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

      {/* Recording and Generation Indicators */}
      {(isRecording || loading) && (
        <div className="absolute -top-8 left-0 right-0 flex items-center justify-center">
          <div className="glass backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-xs">
                {isRecording ? 'Recording...' : generateImage ? 'Generating text and image...' : 'Generating...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Character Counter and Image Generation Status */}
      <div className="absolute -top-5 right-0 flex items-center gap-2">
        {generateImage && (
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-full border border-purple-300/30">
            <Image className="w-2.5 h-2.5 text-purple-400" />
            <span className="text-xs text-purple-400 font-medium">Image</span>
          </div>
        )}
        {message.length > 0 && (
          <span className={`text-xs ${
            message.length > 500 ? 'text-red-400' : 'text-white/60'
          }`}>
            {message.length}/1000
          </span>
        )}
      </div>
    </form>
  );
}