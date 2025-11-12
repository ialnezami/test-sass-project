import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des workspaces
 * 🔧 VERSION DEMO - Repository de test
 */

export interface WorkspaceType {
  id: string;
  name: string;
  color: string;
  hexColor: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

export class WorkspaceRepository {
  // @ts-expect-error - Reserved for future use in placeholder repository
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  // ✅ Méthodes avec isolation workspace
  async getByUser(userId: string): Promise<WorkspaceType[]> {
    // Note: À implémenter avec la vraie requête SQL
    // Pour l'instant, retourne un tableau vide
    return [];
  }

  // ✅ TOUJOURS récupérer avec workspace pour sécurité
  async getById(id: string, workspaceId: string): Promise<WorkspaceType | null> {
    // Note: À implémenter avec la vraie requête SQL
    return null;
  }
}

