'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const errorType = searchParams.get('error');
    
    switch (errorType) {
      case 'CredentialsSignin':
        setError('Invalid credentials. Please check your email and password.');
        break;
      case 'EmailExists':
        setError('This email is already registered. Please use a different email or try logging in.');
        break;
      case 'Configuration':
        setError('There was a configuration error. Please contact support.');
        break;
      case 'AccessDenied':
        setError('Access denied. You do not have permission to sign in.');
        break;
      case 'Verification':
        setError('The sign in link is no longer valid. Please request a new one.');
        break;
      default:
        setError('An unexpected error occurred during authentication.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Error
            </h1>
            
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
              
              <button
                onClick={() => router.push('/signup')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Registration
              </button>
              
              <button
                onClick={() => router.push('/debug-auth')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Debug Authentication
              </button>
            </div>
          </div>
        </div>
        
        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Still having issues?{' '}
            <button
              onClick={() => router.push('/clear-data')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all data and reset
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 