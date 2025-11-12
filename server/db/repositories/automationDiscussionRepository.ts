import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des discussions d'automatisation
 * 🔧 VERSION DEMO - Repository de test
 */

export class AutomationDiscussionRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

