'use client';
import React from 'react';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Chatbot from '@/components/Chatbot';
import { Menu, X, Sparkles, Star, Zap, LogOut, Settings } from 'lucide-react';
import type { GeneratedSection } from '@/types/api';
import { PromptChain } from '@/components/promptchaining';
import { useAuth } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';


export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatbotCollapsed, setIsChatbotCollapsed] = useState(false);
  // Dashboard handles its own state
  
  // Auth state and logout functionality
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  // Dashboard handles its own content

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading BrainStrata...</h2>
          <p className="text-white/60">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

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
          <div className="fixed inset-y-0 left-0 w-54 bg-gradient-to-b from-white/95 via-white/90 to-white/95 backdrop-blur-2xl z-50 border-r border-white/30 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/30 bg-gradient-to-r from-purple-50 to-pink-50">
              <h2 className="text-base font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">Navigation</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 hover:bg-white/30 rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-110 hover:rotate-90"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 min-h-screen">
        {/* Enhanced Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-3 bg-gradient-to-r from-white/10 via-white/20 to-white/10 backdrop-blur-2xl border-b border-white/30 shadow-lg">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-white/30 rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-110 hover:rotate-12 group"
          >
            <Menu className="w-4 h-4 text-white group-hover:text-purple-200" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse hover:animate-spin">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <h1 className="text-base font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
              BrainStrata
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="p-2 hover:bg-white/30 rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-110 group"
            >
              <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-full animate-pulse shadow-lg group-hover:shadow-emerald-500/50" />
            </button>
            {isAuthenticated && (
              <>
                <button
                  onClick={() => router.push('/settings')}
                  className="p-2 hover:bg-white/30 rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-110 group"
                >
                  <Settings className="w-4 h-4 text-white group-hover:text-purple-200 group-hover:scale-110 transition-all" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 group"
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Generated Content - Perfectly centered between sidebars */}
        <div className="flex-1 h-full lg:flex">
          {/* Left spacer - matches sidebar width */}
          <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-12' : 'w-48'}`}></div>
          
          {/* Main content area - takes remaining space */}
          <div className="flex-1 h-full overflow-auto">
            <Dashboard />
          </div>
          
          {/* Right spacer - matches chatbot width */}
          <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${isChatbotCollapsed ? 'w-12' : 'w-56'}`}></div>
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
          <div className="flex items-center justify-between p-4 border-b border-white/30 bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Assistant
            </h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 hover:bg-white/30 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-4 h-4 text-gray-700" />
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