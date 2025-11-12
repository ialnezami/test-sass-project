import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des leads
 * 🔧 VERSION DEMO - Repository de test
 */

export interface LeadType {
  id: string;
  workspace_id: string;
  email: string;
  name?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

export class LeadRepository {
  // @ts-expect-error - Reserved for future use in placeholder repository
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  // ✅ Méthodes avec isolation workspace
  async getByWorkspace(workspaceId: string): Promise<LeadType[]> {
    // Note: À implémenter avec la vraie requête SQL
    return [];
  }

  // ✅ TOUJOURS récupérer avec workspace pour sécurité
  async getById(id: string, workspaceId: string): Promise<LeadType | null> {
    // Note: À implémenter avec la vraie requête SQL
    return null;
  }
}

