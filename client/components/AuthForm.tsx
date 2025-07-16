'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/stores/authStore';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

interface AuthFormProps {
  type: 'login' | 'signup';
}

// Simulated API calls for demonstration
const simulateAuth = {
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation for demo
    if (email === 'demo@example.com' && password === 'password') {
      return {
        success: true,
        user: {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          image: null,
        }
      };
    }
    
    // For any other email/password combination, create a "user" for demo
    if (email && password.length >= 6) {
      const userName = email.split('@')[0];
      return {
        success: true,
        user: {
          id: Date.now().toString(),
          email: email,
          name: userName.charAt(0).toUpperCase() + userName.slice(1),
          image: null,
        }
      };
    }
    
    throw new Error('Invalid email or password');
  },
  
  signup: async (email: string, password: string, name: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simple validation for demo
    if (email && password.length >= 6 && name) {
      return {
        success: true,
        user: {
          id: Date.now().toString(),
          email: email,
          name: name,
          image: null,
        }
      };
    }
    
    throw new Error('Please fill in all fields correctly');
  }
};

export function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, setLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (type === 'signup') {
        if (!data.name) {
          throw new Error('Name is required for signup');
        }
        result = await simulateAuth.signup(data.email, data.password, data.name);
      } else {
        result = await simulateAuth.login(data.email, data.password);
      }

      if (result.success && result.user) {
        // Store user in Zustand store
        login(result.user);
        
        // Redirect will be handled automatically by AuthGuard
        console.log('✅ Authentication successful, redirecting...');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card */}
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border border-white/30 overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-6 relative overflow-hidden">
          {/* Header background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Shield className="h-7 w-7 text-white drop-shadow-sm" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center drop-shadow-sm">
              {type === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-white/90 text-center mt-2 text-sm font-medium">
              {type === 'login' 
                ? 'Sign in to access your dashboard' 
                : 'Join thousands of users on our platform'
              }
            </p>
          </div>
        </div>

        <div className="px-6 py-6 bg-gradient-to-b from-white to-gray-50/50">
          {/* Demo Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/60 rounded-2xl shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1.5 mr-3 shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <h4 className="text-sm font-bold text-gray-800">Demo Mode Active</h4>
            </div>
            <div className="text-xs text-gray-700 space-y-2 leading-relaxed">
              <p className="flex items-center">
                <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                Use any email/password (min 6 chars) to {type}
              </p>
              <p className="flex items-center">
                <span className="w-1 h-1 bg-purple-500 rounded-full mr-2"></span>
                Try: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded-lg mx-1 font-semibold">demo@example.com</span> / <span className="font-mono bg-purple-100 px-2 py-0.5 rounded-lg mx-1 font-semibold">password</span>
              </p>
              <p className="flex items-center">
                <span className="w-1 h-1 bg-indigo-500 rounded-full mr-2"></span>
                Data persists in localStorage
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 border border-red-200/60 rounded-2xl shadow-sm">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-1.5 mr-3 shadow-sm">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-sm text-red-800 font-semibold">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Field (Signup Only) */}
            {type === 'signup' && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold text-gray-800">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-all duration-200" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300 hover:shadow-md focus:shadow-lg font-medium"
                    {...register('name', { 
                      required: type === 'signup' ? 'Name is required' : false,
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center font-medium">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-gray-800">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-all duration-200" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300 hover:shadow-md focus:shadow-lg font-medium"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center font-medium">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-gray-800">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-all duration-200" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300 hover:shadow-md focus:shadow-lg font-medium"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-2xl transition-all duration-200 group"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 group-hover:scale-110 transition-all duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 group-hover:scale-110 transition-all duration-200" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center font-medium">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl group"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>{type === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Switch Auth Type */}
          <div className="mt-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  {type === 'login' ? "Don't have an account?" : 'Already have an account?'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push(type === 'login' ? '/signup' : '/login')}
              className="w-full py-3 px-6 border-2 border-gray-300 rounded-2xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              {type === 'login' ? 'Create new account' : 'Sign in instead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 