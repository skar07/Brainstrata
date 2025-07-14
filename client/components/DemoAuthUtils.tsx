'use client';

import { useAuth } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Settings, RefreshCw } from 'lucide-react';

export function DemoAuthUtils() {
  const { user, isAuthenticated, logout, login } = useAuth();

  const handleDemoLogin = () => {
    login({
      id: 'demo-123',
      email: 'demo@example.com',
      name: 'Demo User',
      image: null,
    });
  };

  const handleLogout = () => {
    logout();
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Demo Auth Utils
        </CardTitle>
        <CardDescription>
          Test authentication functionality quickly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Current Status:</h4>
          <Badge variant={isAuthenticated ? "default" : "secondary"}>
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Badge>
          {user && (
            <div className="text-sm text-gray-600">
              <p>User: {user.name}</p>
              <p>Email: {user.email}</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Quick Actions:</h4>
          
          {!isAuthenticated ? (
            <Button onClick={handleDemoLogin} className="w-full" size="sm">
              <User className="w-4 h-4 mr-2" />
              Demo Login
            </Button>
          ) : (
            <Button onClick={handleLogout} variant="outline" className="w-full" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}

          <Button onClick={clearLocalStorage} variant="destructive" className="w-full" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        </div>

        {/* Test Instructions */}
        <div className="space-y-2 pt-4 border-t">
          <h4 className="text-sm font-semibold">Test Flow:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>1. Click "Demo Login" to authenticate</p>
            <p>2. Should redirect to homepage (/)</p>
            <p>3. Click "Logout" to clear auth</p>
            <p>4. Should redirect to /login</p>
            <p>5. Use forms with any email/password</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 