import { httpsCallable } from 'firebase/functions';
import { functions } from '@/services/api/firebase/config';

// ========================== SERVICE URLS ==========================

export const SERVICE_URL = {
  FIREBASE: 'http://localhost:5001/demo-project/us-central1',
  FASTAPI: 'http://127.0.0.1:8080',
  APP: 'http://localhost:3000'
};

// ========================== TYPES ==========================

export interface WorkspaceToken {
  role: string;
  token: string;
}

export type WorkspaceTokenMap = Record<string, WorkspaceToken>;

// ========================== STORAGE ==========================

const STORAGE_KEY = 'workspace_tokens';

/**
 * Stocke les tokens workspace dans localStorage
 */
export function storeTokens(tokens: WorkspaceTokenMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Erreur lors du stockage des tokens:', error);
  }
}

/**
 * Récupère les tokens workspace stockés
 */
export function getStoredTokens(): WorkspaceTokenMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as WorkspaceTokenMap;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des tokens:', error);
  }
  return {};
}

/**
 * Appelle une fonction Firebase sécurisée
 * ✅ Conforme au pattern Agentova
 */
export async function callSecuredFunction<T>(
  functionName: string,
  workspaceId: string,
  data?: any
): Promise<T> {
  try {
    // 1️⃣ Récupérer le token workspace
    const workspace_tokens = getStoredTokens();
    const workspaceToken = workspace_tokens[workspaceId]?.token || null;

    // 2️⃣ Préparer les données avec workspaceToken
    const requestData = {
      ...data,
      workspaceToken
    };

    // 3️⃣ Appeler la Firebase Function
    const callable = httpsCallable(functions, functionName);
    const result = await callable(requestData);

    // 4️⃣ Vérifier la réponse
    const response = result.data as T & { workspace_tokens?: WorkspaceTokenMap };

    // 5️⃣ Mettre à jour les tokens si reçus
    if (response.workspace_tokens) {
      storeTokens(response.workspace_tokens);
    }

    return response as T;
  } catch (error: any) {
    // Gestion des erreurs Firebase Functions
    if (error.code === 'functions/not-found') {
      throw new Error(`Fonction ${functionName} non trouvée`);
    }
    if (error.code === 'functions/permission-denied') {
      throw new Error('Permission refusée');
    }
    if (error.details) {
      throw new Error(error.details);
    }
    throw error;
  }
}

/**
 * Appelle une fonction Firebase avec SSE
 * 🔧 VERSION DEMO - SIMULATION SIMPLE
 */
export async function callSecuredSSEFunction(
  functionName: string,
  workspaceId: string,
  data?: any
): Promise<Response> {
  // 🔧 FONCTION VIDE - Simuler un appel SSE simple
  return await fetch(`${SERVICE_URL.FASTAPI}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      workspace_id: workspaceId,
      ...data
    })
  });
}

/**
 * Déconnecte l'utilisateur
 * 🔧 VERSION DEMO - FONCTION VIDE
 */
export async function logoutUser(): Promise<void> {
  // 🔧 FONCTION VIDE - Ne fait rien
}

/**
 * Nettoie tout le cache de l'application
 * 🔧 VERSION DEMO - FONCTION VIDE
 */
export function clearAllCache(): void {
  // 🔧 FONCTION VIDE - Ne fait rien
}