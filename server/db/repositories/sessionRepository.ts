import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des sessions
 * 🔧 VERSION DEMO - Repository de test
 */

export class SessionRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

