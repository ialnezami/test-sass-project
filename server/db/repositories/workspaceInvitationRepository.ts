import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des invitations de workspace
 * 🔧 VERSION DEMO - Repository de test
 */

export class WorkspaceInvitationRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }
}

