import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des réponses aux commentaires
 * 🔧 VERSION DEMO - Repository de test
 */

export interface ReplyCommentType {
  id: string;
  workspace_id: string;
  comment_id: string;
  reply_text: string;
  created_at: Date;
  updated_at: Date;
}

export class ReplyCommentRepository {
  // @ts-expect-error - Reserved for future use in placeholder repository
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  // ✅ Méthodes avec isolation workspace
  async getByWorkspace(workspaceId: string): Promise<ReplyCommentType[]> {
    // Note: À implémenter avec la vraie requête SQL
    return [];
  }

  // ✅ TOUJOURS récupérer avec workspace pour sécurité
  async getById(id: string, workspaceId: string): Promise<ReplyCommentType | null> {
    // Note: À implémenter avec la vraie requête SQL
    return null;
  }
}

