'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/stores/authStore';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean; // true = require auth, false = require no auth, undefined = no requirement
  redirectTo?: string; // custom redirect path
}

export function AuthGuard({ 
  children, 
  requireAuth, 
  redirectTo 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If requireAuth is undefined, no auth check needed
    if (requireAuth === undefined) return;

    console.log('🛡️ AuthGuard: Checking auth status', {
      isAuthenticated,
      requireAuth,
      pathname,
    });

    if (requireAuth === true && !isAuthenticated) {
      // User needs to be authenticated but isn't
      const redirectPath = redirectTo || '/login';
      console.log(`🔒 AuthGuard: Redirecting unauthenticated user to ${redirectPath}`);
      router.push(redirectPath);
    } else if (requireAuth === false && isAuthenticated) {
      // User should not be authenticated but is
      const redirectPath = redirectTo || '/';
      console.log(`🏠 AuthGuard: Redirecting authenticated user to ${redirectPath}`);
      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, pathname]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If we need auth but don't have it, don't render children
  if (requireAuth === true && !isAuthenticated) {
    return null;
  }

  // If we shouldn't be authed but are, don't render children
  if (requireAuth === false && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// Convenience wrapper for protected pages (require auth)
export function ProtectedRoute({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      {children}
    </AuthGuard>
  );
}

// Convenience wrapper for public pages (require no auth)
export function PublicRoute({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      {children}
    </AuthGuard>
  );
}

// Convenience wrapper for pages that work with or without auth
export function FlexibleRoute({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth={undefined}>
      {children}
    </AuthGuard>
  );
} 