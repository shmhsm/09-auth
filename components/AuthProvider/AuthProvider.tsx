'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import { checkSession } from '../../lib/api/clientApi';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPrivateRoute = pathname.startsWith('/profile') || pathname.startsWith('/notes');
  const isAuthRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
          if (isAuthRoute) router.replace('/profile');
        } else {
          clearIsAuthenticated();
          if (isPrivateRoute) router.replace('/sign-in');
        }
      } catch {
        clearIsAuthenticated();
        if (isPrivateRoute) router.replace('/sign-in');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [pathname, setUser, clearIsAuthenticated, router, isPrivateRoute, isAuthRoute]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading session...</p>
      </div>
    );
  }

  return <>{children}</>;
}