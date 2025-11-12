import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des documents de workspace
 * 🔧 VERSION DEMO - Repository de test
 */

export class WorkspaceDocumentRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

