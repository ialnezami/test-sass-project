import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des tokens OAuth
 * 🔧 VERSION DEMO - Repository de test
 */

export interface OAuthTokenType {
  id: string;
  workspace_id: string;
  provider: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export class OAuthTokenRepository {
  // @ts-expect-error - Reserved for future use in placeholder repository
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  // ✅ Méthodes avec isolation workspace
  async getByWorkspace(workspaceId: string): Promise<OAuthTokenType[]> {
    // Note: À implémenter avec la vraie requête SQL
    return [];
  }

  // ✅ TOUJOURS récupérer avec workspace pour sécurité
  async getById(id: string, workspaceId: string): Promise<OAuthTokenType | null> {
    // Note: À implémenter avec la vraie requête SQL
    return null;
  }
}

