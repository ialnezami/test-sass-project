import { Pool } from 'pg';
import { getPool } from '../config.js';

/**
 * Repository pour la gestion de la génération d'images
 * 🔧 VERSION DEMO - Repository de test
 */

export interface ImageGenerationType {
  id: string;
  workspace_id: string;
  prompt: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export class ImageGenerationRepository {
  // @ts-expect-error - Reserved for future use in placeholder repository
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  // ✅ Méthodes avec isolation workspace
  async getByWorkspace(workspaceId: string): Promise<ImageGenerationType[]> {
    // Note: À implémenter avec la vraie requête SQL
    return [];
  }

  // ✅ TOUJOURS récupérer avec workspace pour sécurité
  async getById(id: string, workspaceId: string): Promise<ImageGenerationType | null> {
    // Note: À implémenter avec la vraie requête SQL
    return null;
  }
}

