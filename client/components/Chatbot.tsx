'use client';

import { useState, useRef } from 'react';
import MessageInput from './MessageInput';
import { Bot, User, ThumbsUp, ThumbsDown, Copy, RotateCcw, Link } from 'lucide-react';
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
  onNewGeneratedContent?: (sections: GeneratedSection[]) => void;
  onGeneratingStateChange?: (generating: boolean) => void;
  onChainUpdate?: (chain: PromptChain) => void;
}

export default function Chatbot({ 
  onNewGeneratedContent, 
  onGeneratingStateChange,
  onChainUpdate
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI learning assistant. I can help you understand concepts, answer questions, and provide additional explanations about the lesson. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const promptChainRef = useRef<PromptChain | null>(null);

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
    }
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

  const currentChainDepth = promptChainRef.current?.getCurrentDepth() || 0;

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Assistant</h3>
              <p className="text-xs text-blue-100">Always ready to help</p>
            </div>
          </div>
          
          {/* Chain Status & Reset */}
          {currentChainDepth > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full">
                <Link className="w-3 h-3 text-white" />
                <span className="text-xs text-white">{currentChainDepth}/5</span>
              </div>
              <button
                onClick={resetChain}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Reset conversation context"
              >
                <RotateCcw className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.isBot ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.isBot && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isChained 
                  ? 'bg-gradient-to-br from-purple-500 to-blue-600'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[70%] p-3 rounded-lg relative group ${
                message.isBot
                  ? message.isChained
                    ? 'bg-purple-50 text-gray-900 border border-purple-200'
                    : 'bg-gray-100 text-gray-900'
                  : message.isChained
                    ? 'bg-purple-500 text-white'
                    : 'bg-blue-500 text-white'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.isChained && (
                  <Link className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" />
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.isChained && (
                      <span className="text-xs opacity-70 bg-black/10 px-1 rounded">
                        Contextual
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {message.isBot && (
                <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!message.isBot && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isChained ? 'bg-purple-400' : 'bg-gray-400'
              }`}>
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              currentChainDepth > 0 
                ? 'bg-gradient-to-br from-purple-500 to-blue-600'
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className={`p-3 rounded-lg ${
              currentChainDepth > 0 
                ? 'bg-purple-50 border border-purple-200'
                : 'bg-gray-100'
            }`}>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-600">Quick questions:</p>
          {currentChainDepth > 0 && (
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              Chain Mode Active
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            currentChainDepth > 0 ? "Continue this topic" : "Tell me about heart",
            currentChainDepth > 0 ? "Give me examples" : "Explain quantum physics",
            currentChainDepth > 0 ? "Go deeper" : "How does AI work?",
          ].map((question, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(question)}
              className={`px-3 py-1 border rounded-full text-xs transition-colors ${
                currentChainDepth > 0
                  ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <MessageInput 
        onSendMessage={handleSendMessage}
        onNewGeneratedContent={onNewGeneratedContent}
        onGeneratingStateChange={onGeneratingStateChange}
        onChainUpdate={handleChainUpdate}
      />
    </div>
  );
}