import { Metadata } from 'next';
import { AuthForm } from '@/components/AuthForm';
import { Sparkles, Star, Zap, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign Up | Brainstrata',
  description: 'Create a new account',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
        
        {/* Floating Stars */}
        <div className="absolute top-1/4 left-1/4 text-white/20 animate-pulse">
          <Star className="w-6 h-6" />
        </div>
        <div className="absolute top-1/3 right-1/3 text-white/20 animate-pulse animation-delay-2000">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 text-white/20 animate-pulse animation-delay-4000">
          <Zap className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-violet-300 bg-clip-text text-transparent mb-2">
            BrainStrata
          </h1>
          <p className="text-white/70 text-sm font-medium">Learning Platform</p>
        </div>

        {/* Auth Form Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/50 rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Join BrainStrata
              </h2>
              <p className="text-gray-600 text-sm">
                Create your account and start learning today
              </p>
            </div>
            
            <AuthForm type="signup" />
            
            {/* Features List */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">What you'll get:</p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></div>
                  Access to premium courses
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-2"></div>
                  Interactive learning materials
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-2"></div>
                  AI-powered learning assistant
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/60 text-sm">
          <p>Secure and encrypted authentication</p>
        </div>
      </div>
    </div>
  );
} 