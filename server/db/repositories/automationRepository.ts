import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des automatisations
 * 🔧 VERSION DEMO - Repository de test
 */

export class AutomationRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

