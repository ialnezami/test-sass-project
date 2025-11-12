import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des campagnes
 * 🔧 VERSION DEMO - Repository de test
 */

export interface CampaignType {
  id: string;
  workspace_id: string;
  name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export class CampaignRepository {
  // @ts-expect-error - Reserved for future use in placeholder repository
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  // ✅ Méthodes avec isolation workspace
  async getByWorkspace(workspaceId: string): Promise<CampaignType[]> {
    // Note: À implémenter avec la vraie requête SQL
    return [];
  }

  // ✅ TOUJOURS récupérer avec workspace pour sécurité
  async getById(id: string, workspaceId: string): Promise<CampaignType | null> {
    // Note: À implémenter avec la vraie requête SQL
    return null;
  }
}

