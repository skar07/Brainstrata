'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import GeneratedContent from '@/components/GeneratedContent';
import Chatbot from '@/components/Chatbot';
import { Menu, X, Sparkles, Star, Zap } from 'lucide-react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatbotCollapsed, setIsChatbotCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-6000"></div>
        
        {/* Floating Stars */}
        <div className="absolute top-1/4 left-1/4 text-white/20 animate-pulse">
          <Star className="w-4 h-4" />
        </div>
        <div className="absolute top-1/3 right-1/3 text-white/20 animate-pulse animation-delay-2000">
          <Sparkles className="w-3 h-3" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-white/20 animate-pulse animation-delay-4000">
          <Zap className="w-4 h-4" />
        </div>
      </div>

      {/* Enhanced Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-white/95 via-white/90 to-white/95 backdrop-blur-2xl z-50 border-r border-white/30 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/30 bg-gradient-to-r from-purple-50 to-pink-50">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">Navigation</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-110 hover:rotate-90"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col relative z-10 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-80'} ${isChatbotCollapsed ? 'lg:pr-20' : 'lg:pr-96'}`}>
        {/* Enhanced Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-gradient-to-r from-white/10 via-white/20 to-white/10 backdrop-blur-2xl border-b border-white/30 shadow-lg">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-110 hover:rotate-12 group"
          >
            <Menu className="w-5 h-5 text-white group-hover:text-purple-200" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse hover:animate-spin">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
              BrainStrata
            </h1>
          </div>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="p-3 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-110 group"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-full animate-pulse shadow-lg group-hover:shadow-emerald-500/50" />
          </button>
        </div>

        {/* Generated Content */}
        <div className="flex-1 h-full">
          <GeneratedContent />
        </div>
      </div>

      {/* Enhanced Desktop Sidebar - Fixed Position */}
      <div className="hidden lg:block fixed top-0 left-0 z-20">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Enhanced Desktop Chatbot - Fixed Position */}
      <div className="hidden lg:block fixed top-0 right-0 z-20">
        <Chatbot 
          isCollapsed={isChatbotCollapsed}
          setIsCollapsed={setIsChatbotCollapsed}
        />
      </div>

      {/* Enhanced Mobile Chatbot */}
      {isChatOpen && (
        <div className="lg:hidden fixed inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-2xl z-40">
          <div className="flex items-center justify-between p-6 border-b border-white/30 bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Assistant
            </h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 hover:bg-white/30 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <div className="h-full">
            <Chatbot />
          </div>
        </div>
      )}
    </div>
  );
}