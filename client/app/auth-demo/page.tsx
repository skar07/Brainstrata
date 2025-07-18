'use client';

import { FlexibleRoute } from '@/components/AuthGuard';
import { DemoAuthUtils } from '@/components/DemoAuthUtils';
import { useAuth } from '@/lib/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Key, Settings } from 'lucide-react';

export default function AuthDemoPage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <FlexibleRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🔐 Zustand Authentication Demo</h1>
            <p className="text-gray-600">
              Test the authentication system with Zustand state management and localStorage persistence
            </p>
          </div>

          {/* Current State */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Current Authentication State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Status:</h4>
                  <Badge variant={isAuthenticated ? "default" : "secondary"} className="mb-2">
                    {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
                  </Badge>
                  
                  {user && (
                    <div className="space-y-1 text-sm">
                      <p><strong>ID:</strong> {user.id}</p>
                      <p><strong>Name:</strong> {user.name}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">localStorage Data:</h4>
                  <div className="text-xs bg-gray-100 p-2 rounded font-mono">
                    {typeof window !== 'undefined' && localStorage.getItem('auth-storage') 
                      ? JSON.stringify(JSON.parse(localStorage.getItem('auth-storage') || '{}'), null, 2)
                      : 'No data stored'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Utils */}
          <DemoAuthUtils />

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5" />
                  Route Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>/</strong> - Shows dashboard if authenticated, redirects to login if not</p>
                  <p><strong>/login</strong> - Redirects if authenticated</p>
                  <p><strong>/signup</strong> - Redirects if authenticated</p>
                  <p><strong>/auth-demo</strong> - This demo page</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Key className="w-5 h-5" />
                  State Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• Zustand store with persistence</p>
                  <p>• localStorage integration</p>
                  <p>• Automatic state rehydration</p>
                  <p>• Real-time auth status updates</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5" />
                  Demo Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• Simulated API authentication</p>
                  <p>• Automatic redirects</p>
                  <p>• Persistent sessions</p>
                  <p>• Quick test utilities</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 How to Test</CardTitle>
              <CardDescription>
                Follow these steps to test the complete authentication flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">✅ Authentication Flow:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Go to <code className="bg-gray-100 px-1 rounded">/login</code> or <code className="bg-gray-100 px-1 rounded">/signup</code></li>
                    <li>Use any email/password (min 6 characters) or "demo@example.com" / "password"</li>
                    <li>Should automatically redirect to <code className="bg-gray-100 px-1 rounded">/</code> (homepage with dashboard)</li>
                    <li>Click logout - should redirect to <code className="bg-gray-100 px-1 rounded">/login</code></li>
                    <li>Try accessing <code className="bg-gray-100 px-1 rounded">/</code> while logged out - should redirect to login</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">🔧 Technical Details:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>State persists across browser sessions via localStorage</li>
                    <li>AuthGuard components handle all redirects automatically</li>
                    <li>Zustand middleware handles state persistence</li>
                    <li>Authentication state rehydrates on page load</li>
                    <li>All redirects happen client-side for better UX</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FlexibleRoute>
  );
} 