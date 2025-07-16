'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Chatbot from '@/components/Chatbot';
import { ArrowLeft, Brain, MessageSquare, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/stores/authStore';

export default function LearnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [presetPrompt, setPresetPrompt] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt) {
      setPresetPrompt(decodeURIComponent(prompt));
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading LearnAI...</h2>
          <p className="text-white/60">Preparing your learning environment...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Learning Assistant</h1>
                <p className="text-white/70">Your personalized learning companion</p>
              </div>
            </div>
          </div>

          {presetPrompt && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-violet-500/10 backdrop-blur-xl border border-purple-400/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-300" />
                <h3 className="text-lg font-semibold text-white">Quick Start Topic</h3>
              </div>
              <p className="text-white/80 mb-3">{presetPrompt}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    // This would trigger the chatbot with the preset prompt
                    // Implementation depends on your chatbot component
                    setPresetPrompt(null);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm"
                >
                  Start Learning
                </button>
                <button 
                  onClick={() => setPresetPrompt(null)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
                >
                  Clear Topic
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 h-[calc(100vh-200px)]">
        <div className="h-full max-w-4xl mx-auto px-4 lg:px-6">
                     <div className="h-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg overflow-hidden">
             <Chatbot />
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>AI-powered learning conversations</span>
            </div>
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
            <span>Personalized to your learning style</span>
          </div>
        </div>
      </div>
    </div>
  );
} 