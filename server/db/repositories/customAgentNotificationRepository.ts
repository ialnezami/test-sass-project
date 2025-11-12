import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des notifications d'agents personnalisés
 * 🔧 VERSION DEMO - Repository de test
 */

export class CustomAgentNotificationRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

