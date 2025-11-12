import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des états de boîte de réception
 * 🔧 VERSION DEMO - Repository de test
 */

export class InboxStatesRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

