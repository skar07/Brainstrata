'use client';

import { PublicRoute } from '@/components/AuthGuard';
import { AuthForm } from '@/components/AuthForm';
import { Sparkles, Shield, Zap, Brain, Users, TrendingUp } from 'lucide-react';

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large gradient orbs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
          
          {/* Floating particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rounded-full animate-float"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/60 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400/60 rounded-full animate-float animation-delay-3000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Features */}
          <div className="hidden lg:block space-y-8">
            {/* Brand Header */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Brainstrata
                  </h1>
                  <p className="text-blue-200/80 text-lg font-medium">
                    Next-Generation Learning Platform
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-blue-100/90 leading-relaxed">
                Transform your learning experience with AI-powered insights, personalized pathways, and collaborative tools designed for the future of education.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">AI-Powered Learning</h3>
                <p className="text-blue-200/70 text-sm">Intelligent content adaptation based on your learning style and progress.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Collaborative Space</h3>
                <p className="text-blue-200/70 text-sm">Connect with peers, share insights, and learn together in real-time.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Progress Analytics</h3>
                <p className="text-blue-200/70 text-sm">Detailed insights into your learning journey and achievement patterns.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Instant Support</h3>
                <p className="text-blue-200/70 text-sm">24/7 AI assistant ready to help with concepts, explanations, and guidance.</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-blue-200/70 text-sm">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-blue-200/70 text-sm">Lessons Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-blue-200/70 text-sm">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-2xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Brainstrata
                </h1>
              </div>
              <p className="text-blue-200/80 text-lg">
                Your intelligent learning platform
              </p>
            </div>
            
            <AuthForm type="login" />
            
            {/* Additional Links */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-blue-200/70">
                <a href="#" className="hover:text-blue-200 transition-colors flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </a>
                <span>•</span>
                <a href="#" className="hover:text-blue-200 transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#" className="hover:text-blue-200 transition-colors">Help Center</a>
              </div>
              
              <div className="text-center">
                <p className="text-blue-200/60 text-sm">
                  © 2024 Brainstrata. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Elements */}
        <div className="absolute top-8 right-8 hidden xl:block">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium">System Online</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 hidden xl:block">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">New Features Available</span>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
} 