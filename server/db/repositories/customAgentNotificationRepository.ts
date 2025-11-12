import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion des notifications d'agents personnalisés
 * 🔧 VERSION DEMO - Repository de test
 */

export interface CustomAgentNotificationType {
  id: string;
  workspace_id: string;
  custom_agent_id: string;
  enabled: boolean;
  config: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export class CustomAgentNotificationRepository {
  // @ts-expect-error - Reserved for future use in placeholder repository
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  // ✅ Méthodes avec isolation workspace
  async getByCustomAgent(customAgentId: string, workspaceId: string): Promise<CustomAgentNotificationType[]> {
    // Note: À implémenter avec la vraie requête SQL
    return [];
  }

  // ✅ TOUJOURS récupérer avec workspace pour sécurité
  async getById(id: string, workspaceId: string): Promise<CustomAgentNotificationType | null> {
    // Note: À implémenter avec la vraie requête SQL
    return null;
  }
}

