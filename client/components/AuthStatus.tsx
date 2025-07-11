'use client';

import { useAuthSession } from '@/lib/auth/sessionClient';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AuthStatus() {
  const { user, isAuthenticated, isLoading } = useAuthSession();
  const router = useRouter();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-1.5 pb-1.5 px-2 sm:px-3">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full border-gray-200 shadow-sm">
        <CardHeader className="pb-1 px-2 sm:px-3 text-center">
          <CardTitle className="text-xs sm:text-sm font-semibold">Not Authenticated</CardTitle>
          <CardDescription className="text-xs text-gray-500 mt-0.5 hidden sm:block">
            Please sign in to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 px-2 sm:px-3 pb-2">
          <div className="flex gap-1">
            <Button 
              className="flex-1 h-6 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200" 
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-6 text-xs font-medium border-gray-300 text-gray-700 hover:bg-gray-50 rounded transition-colors duration-200"
              onClick={() => router.push('/signup')}
            >
              Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-gray-200 shadow-sm">
      <CardHeader className="pb-1 px-2 sm:px-3 text-center">
        <CardTitle className="text-xs sm:text-sm font-semibold">Welcome!</CardTitle>
        <CardDescription className="text-xs text-gray-500 mt-0.5 hidden sm:block">
          You are successfully authenticated.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 px-2 sm:px-3 pb-2">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Avatar className="h-5 w-5 border border-gray-200">
            <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
            <AvatarFallback className="text-xs font-medium bg-blue-100 text-blue-600">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-medium text-xs text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: '/login' })}
          variant="outline"
          className="w-full h-6 text-xs font-medium border-gray-300 text-gray-700 hover:bg-gray-50 rounded transition-colors duration-200"
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
} 