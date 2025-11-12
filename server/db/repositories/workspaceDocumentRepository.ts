import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des documents de workspace
 * 🔧 VERSION DEMO - Repository de test
 */

export interface WorkspaceDocumentType {
  id: string;
  workspace_id: string;
  name: string;
  type: string;
  url?: string;
  created_at: Date;
  updated_at: Date;
}

export class WorkspaceDocumentRepository {
  // @ts-expect-error - Reserved for future use in placeholder repository
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  // ✅ Méthodes avec isolation workspace
  async getByWorkspace(workspaceId: string): Promise<WorkspaceDocumentType[]> {
    // Note: À implémenter avec la vraie requête SQL
    return [];
  }

  // ✅ TOUJOURS récupérer avec workspace pour sécurité
  async getById(id: string, workspaceId: string): Promise<WorkspaceDocumentType | null> {
    // Note: À implémenter avec la vraie requête SQL
    return null;
  }
}

