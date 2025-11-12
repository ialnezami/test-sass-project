'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (!isInitializing) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        // Si non authentifié, on peut rediriger vers une page de login
        // Pour l'instant, on redirige quand même vers dashboard qui gère l'auth
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isInitializing, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="ml-4 text-gray-700">Chargement...</p>
    </div>
  );
}

