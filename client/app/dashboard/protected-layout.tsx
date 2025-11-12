'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * Layout protégé pour les routes du dashboard
 * Vérifie l'authentification avant d'afficher le contenu
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  // Afficher un loader pendant l'initialisation
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers la page de login si non authentifié
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  // Afficher le contenu si authentifié
  return <>{children}</>;
}

