'use client';

import { PublicRoute } from '@/components/AuthGuard';
import { AuthForm } from '@/components/AuthForm';
import { Sparkles, Shield, Zap, Brain, Users, TrendingUp, Star, Target, Award, Rocket } from 'lucide-react';

export default function SignupPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large gradient orbs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-rose-500/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
          
          {/* Floating particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/60 rounded-full animate-float"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-pink-400/60 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-violet-400/60 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-rose-400/60 rounded-full animate-float animation-delay-3000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Registration Benefits */}
          <div className="hidden lg:block space-y-8">
            {/* Brand Header */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                    Join Brainstrata
                  </h1>
                  <p className="text-purple-200/80 text-lg font-medium">
                    Start Your Learning Revolution
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-purple-100/90 leading-relaxed">
                Join thousands of learners who are already transforming their educational journey with cutting-edge AI technology and personalized learning experiences.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg mb-4">What you'll get:</h3>
              
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Personalized AI Tutor</h4>
                      <p className="text-purple-200/70 text-sm">Get instant help, explanations, and guidance tailored to your learning style and pace.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Adaptive Learning Paths</h4>
                      <p className="text-purple-200/70 text-sm">Smart curriculum that adjusts to your progress and identifies areas for improvement.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Global Learning Community</h4>
                      <p className="text-purple-200/70 text-sm">Connect with learners worldwide, participate in study groups, and share knowledge.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Certification & Achievements</h4>
                      <p className="text-purple-200/70 text-sm">Earn recognized certificates and showcase your learning milestones.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">50K+</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-white font-semibold ml-2">4.9</span>
                </div>
              </div>
              <p className="text-purple-200/80 text-sm italic">
                "Brainstrata transformed how I learn. The AI tutor feels like having a personal teacher available 24/7!"
              </p>
              <p className="text-purple-200/60 text-xs mt-2">- Sarah Chen, Computer Science Student</p>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-2xl">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Join Brainstrata
                </h1>
              </div>
              <p className="text-purple-200/80 text-lg">
                Start your learning revolution today
              </p>
            </div>
            
            <AuthForm type="signup" />
            
            {/* Additional Information */}
            <div className="mt-8 space-y-4">
              {/* Free Trial Notice */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Free 7-Day Trial</h4>
                    <p className="text-green-200/70 text-xs">Full access to all premium features. No credit card required.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm text-purple-200/70">
                <a href="#" className="hover:text-purple-200 transition-colors flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </a>
                <span>•</span>
                <a href="#" className="hover:text-purple-200 transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#" className="hover:text-purple-200 transition-colors">Help Center</a>
              </div>
              
              <div className="text-center">
                <p className="text-purple-200/60 text-sm">
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
              <span className="text-white/90 text-sm font-medium">Registration Open</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 hidden xl:block">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white/90 text-sm font-medium">Join 50K+ Students</span>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-8 hidden xl:block">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-white/90 text-sm font-medium">98% Success Rate</span>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
} 