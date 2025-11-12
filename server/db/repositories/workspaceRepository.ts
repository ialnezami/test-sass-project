import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des workspaces
 * 🔧 VERSION DEMO - Repository de test
 */

export class WorkspaceRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

