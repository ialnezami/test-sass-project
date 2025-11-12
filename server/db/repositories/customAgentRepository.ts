import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des agents personnalisés
 * 🔧 VERSION DEMO - Repository de test
 */

export class CustomAgentRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

