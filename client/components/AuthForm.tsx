'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

interface AuthFormProps {
  type: 'login' | 'signup';
}

export function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        name: data.name,
        isSignup: type === 'signup' ? 'true' : 'false',
        redirect: false,
      });

      if (result?.error) {
        // Map specific error messages
        if (result.error === 'CredentialsSignin') {
          if (type === 'signup') {
            setError('Failed to create account. Email might already be registered.');
          } else {
            setError('Invalid email or password. Please check your credentials.');
          }
        } else {
          setError(result.error);
        }
      } else if (result?.ok) {
        // Success! Redirect to home
        router.push('/');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {type === 'signup' && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                {...register('name', {
                  required: type === 'signup' ? 'Name is required' : false,
                })}
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">•</span>
                {errors.name.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                errors.email ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="text-red-500">•</span>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                errors.password ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="text-red-500">•</span>
              {errors.password.message}
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800 flex items-center gap-2">
              <span className="text-red-500">⚠</span>
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:from-purple-700 hover:via-pink-700 hover:to-violet-700 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              {type === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Social Login Options */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <Github className="h-5 w-5" />
            GitHub
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <Chrome className="h-5 w-5" />
            Google
          </button>
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-6 text-center">
        {type === 'login' ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              Sign up here
            </button>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              Sign in here
            </button>
          </p>
        )}
      </div>
    </div>
  );
} 