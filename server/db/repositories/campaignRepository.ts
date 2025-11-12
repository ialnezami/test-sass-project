import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des campagnes
 * 🔧 VERSION DEMO - Repository de test
 */

export class CampaignRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

