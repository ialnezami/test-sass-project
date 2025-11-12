'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

/**
 * Contexte pour les paramètres de chat
 * ✅ Conforme aux règles Agentova : setters stabilisés avec useCallback
 */

interface ChatParamsContextType {
  value: string | null;
  setValue: (value: string | null) => void;
}

const ChatParamsContext = createContext<ChatParamsContextType | undefined>(undefined);

export function ChatParamsProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<string | null>(null);

  // ✅ Handler stabilisé avec useCallback (obligatoire selon les règles)
  const stableSetValue = useCallback((newValue: string | null) => {
    setValue(newValue);
  }, []);

  // ✅ Valeur stabilisée avec useMemo (obligatoire selon les règles)
  const contextValue = useMemo(() => ({
    value,
    setValue: stableSetValue
  }), [value, stableSetValue]);

  return (
    <ChatParamsContext.Provider value={contextValue}>
      {children}
    </ChatParamsContext.Provider>
  );
}

export function useChatParamsContext(): ChatParamsContextType {
  const context = useContext(ChatParamsContext);
  if (!context) {
    throw new Error('useChatParamsContext must be used within a ChatParamsProvider');
  }
  return context;
}

