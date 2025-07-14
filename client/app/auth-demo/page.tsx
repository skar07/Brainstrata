'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  getUsersDatabase, 
  getAllUsers, 
  validateUser,
  StoredUser
} from '@/utils/localStorage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Database, Key, Shield, Trash2, Eye, EyeOff } from 'lucide-react';
import { DataManager } from '@/components/DataManager';

export default function AuthDemoPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<Omit<StoredUser, 'password'>[]>([]);
  const [showPasswords, setShowPasswords] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  };



  const handleTestLogin = () => {
    const result = validateUser(testEmail, testPassword);
    setTestResult(result.message);
    setTimeout(() => setTestResult(''), 3000);
  };

  const getFullUserData = () => {
    if (showPasswords) {
      return getUsersDatabase();
    }
    return users;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication System Demo
          </h1>
          <p className="text-gray-600">
            Test the login/register system and view stored data
          </p>
        </div>

        {/* Current Session */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Current Session
            </CardTitle>
            <CardDescription>Your current authentication status</CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'loading' ? (
              <p>Loading...</p>
            ) : session ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge variant="default" className="bg-green-500">Authenticated</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="font-mono text-sm">{session.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="font-mono text-sm">{session.user.name}</p>
                  </div>
                </div>
                <Button onClick={() => signOut()} variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Badge variant="secondary">Not Authenticated</Badge>
                <p className="text-sm text-gray-500 mt-2">
                  Go to <a href="/login" className="text-purple-600 hover:underline">/login</a> or{' '}
                  <a href="/signup" className="text-purple-600 hover:underline">/signup</a> to test
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Login */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Test Password Validation
            </CardTitle>
            <CardDescription>Test if credentials are valid without logging in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="test@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="password123"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleTestLogin} size="sm">
                  Test Validation
                </Button>
                {testResult && (
                  <Badge variant={testResult.includes('successful') ? 'default' : 'destructive'}>
                    {testResult}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registered Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Registered Users ({users.length})
            </CardTitle>
            <CardDescription>All users stored in localStorage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowPasswords(!showPasswords)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
                </Button>
                <Button onClick={loadUsers} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No users registered yet</p>
                  <p className="text-sm">Register an account to see data here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFullUserData().map((user) => (
                    <div
                      key={user.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500">ID</p>
                          <p className="font-mono text-xs">{user.id}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Email</p>
                          <p className="font-mono text-sm">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Name</p>
                          <p className="text-sm">{user.name}</p>
                        </div>
                        {showPasswords && 'password' in user && (
                          <div>
                            <p className="text-xs font-medium text-gray-500">Password Hash</p>
                            <p className="font-mono text-xs text-red-600 break-all">
                              {(user as StoredUser).password}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-gray-500">Created</p>
                          <p className="text-xs">
                            {new Date(user.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {user.lastLogin && (
                          <div>
                            <p className="text-xs font-medium text-gray-500">Last Login</p>
                            <p className="text-xs">
                              {new Date(user.lastLogin).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Database Actions */}
        <DataManager />

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How the Authentication System Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h4>🔐 Data Storage:</h4>
              <ul>
                <li><strong>Session:</strong> HTTP-only cookies via NextAuth.js (secure)</li>
                <li><strong>User Profile:</strong> localStorage for quick access</li>
                <li><strong>User Database:</strong> localStorage (demo - use real DB in production)</li>
              </ul>

              <h4>🔑 Authentication Flow:</h4>
              <ol>
                <li><strong>Register:</strong> Creates user with hashed password in localStorage</li>
                <li><strong>Login:</strong> Validates email/password against stored data</li>
                <li><strong>Session:</strong> NextAuth creates secure JWT session</li>
                <li><strong>Sync:</strong> User data synced to localStorage for UI</li>
              </ol>

              <h4>🛡️ Security Features:</h4>
              <ul>
                <li>Password hashing (simple hash for demo)</li>
                <li>Duplicate email prevention</li>
                <li>Session expiration (30 days)</li>
                <li>Input validation</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 