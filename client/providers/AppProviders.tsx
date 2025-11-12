'use client';

import { QueryProvider } from './QueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';

/**
 * Wrapper pour tous les providers de l'application
 * ✅ Permet d'utiliser des providers clients dans le root layout
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}

