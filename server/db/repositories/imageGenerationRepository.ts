import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion de la génération d'images
 * 🔧 VERSION DEMO - Repository de test
 */

export class ImageGenerationRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

