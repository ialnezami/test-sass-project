'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * Provider React Query
 * ✅ Conforme au pattern Agentova
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // ✅ Créer QueryClient une seule fois avec useState pour éviter les re-créations
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,                    // Toujours refetch
        refetchOnMount: true,           // Refetch au montage
        placeholderData: (prev: unknown) => prev // Garde données pendant refetch
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools en développement uniquement */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

