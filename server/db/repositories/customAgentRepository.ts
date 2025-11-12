import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des agents personnalisés
 * 🔧 VERSION DEMO - Repository de test
 */

export class CustomAgentRepository {
  // @ts-expect-error - Reserved for future use in placeholder repository
  private _pool: Pool;

  constructor() {
    this._pool = getPool();
  }
}

