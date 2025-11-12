import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des leads
 * 🔧 VERSION DEMO - Repository de test
 */

export class LeadRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

