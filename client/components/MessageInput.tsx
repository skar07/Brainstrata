'use client';

import { useState } from 'react';
import { Send, Paperclip, Smile, Mic, Image } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
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

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-3">
        {/* Input Container */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about the lesson..."
            rows={1}
            className="w-full px-3 py-2 pr-16 glass backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-white placeholder-white/60 resize-none text-xs leading-relaxed"
            style={{ minHeight: '32px', maxHeight: '80px' }}
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
          disabled={!message.trim()}
          className={`p-2 rounded-xl transition-all duration-300 shadow-lg ${
            message.trim()
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