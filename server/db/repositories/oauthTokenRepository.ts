import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des tokens OAuth
 * 🔧 VERSION DEMO - Repository de test
 */

export class OAuthTokenRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

