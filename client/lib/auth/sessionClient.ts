'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setUserToLocalStorage, removeUserFromLocalStorage, getUserFromLocalStorage } from '@/utils/localStorage';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export function useAuthSession() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Store user info in localStorage when authenticated
      const userData: UserSession = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      };
      setUserToLocalStorage(userData);
    } else if (status === 'unauthenticated') {
      // Clear localStorage when unauthenticated
      removeUserFromLocalStorage();
    }
  }, [session, status]);

  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    session,
  };
}

export function getCachedUser(): UserSession | null {
  return getUserFromLocalStorage();
}

export function clearCachedUser(): void {
  removeUserFromLocalStorage();
} 