import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des sessions
 * 🔧 VERSION DEMO - Repository de test
 */

import { Session } from '../../../shared/types.js';

export interface CreateSessionType {
  app_name: string;
  title: string;
  created_by: string;
}

export class SessionRepository {
  // @ts-expect-error - Reserved for future use in placeholder repository
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  // ✅ Méthodes avec isolation workspace
  async getByWorkspace(workspaceId: string, appName?: string): Promise<Session[]> {
    // Note: À implémenter avec la vraie requête SQL
    return [];
  }

  // ✅ TOUJOURS récupérer avec workspace pour sécurité
  async getById(id: string, workspaceId: string): Promise<Session | null> {
    // Note: À implémenter avec la vraie requête SQL
    return null;
  }

  async create(workspaceId: string, data: CreateSessionType): Promise<Session> {
    // Note: À implémenter avec la vraie requête SQL
    return {
      id: 'temp-id',
      workspace_id: workspaceId,
      app_name: data.app_name,
      title: data.title,
      created_at: new Date(),
      updated_at: new Date()
    };
  }
}

