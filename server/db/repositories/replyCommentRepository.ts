import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des réponses aux commentaires
 * 🔧 VERSION DEMO - Repository de test
 */

export class ReplyCommentRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

