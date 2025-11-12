import { callSecuredFunction } from '@/services/local/authenticationService';
import { TextType } from '@shared/types';

/**
 * Service de gestion des textes côté client
 * ✅ Service conforme à l'architecture Agentova
 */

interface SuccessResponse<T> {
  success: true;
  workspace_tokens?: Record<string, unknown>;
}

interface ErrorResponse {
  success: false;
  error: {
    message?: string;
    code?: string;
  };
}

type FirebaseResponse<T> = (SuccessResponse<T> & T) | ErrorResponse;

export class TextService {
  /**
   * Créer un nouveau texte
   */
  static async createText(
    workspaceId: string,
    data: { title?: string; content: string }
  ): Promise<TextType> {
    try {
      const response = await callSecuredFunction<FirebaseResponse<{ text: TextType }>>(
        'createText',
        workspaceId,
        {
          title: data.title,
          content: data.content
        }
      );
      
      // Vérifier si la réponse est une erreur
      if (!response || 'success' in response && response.success === false) {
        const errorResponse = response as ErrorResponse;
        throw new Error(errorResponse.error?.message || 'Erreur lors de la création du texte');
      }

      // Extraire les données de la réponse de succès
      const successResponse = response as SuccessResponse<{ text: TextType }> & { text: TextType };
      const textData = successResponse.text;
      
      // Convertir les dates string en Date si nécessaire
      return {
        ...textData,
        created_at: typeof textData.created_at === 'string' ? new Date(textData.created_at) : textData.created_at,
        updated_at: typeof textData.updated_at === 'string' ? new Date(textData.updated_at) : textData.updated_at
      } as TextType;
    } catch (error) {
      throw error; // ✅ Rethrow pour gestion niveau hook
    }
  }

  /**
   * Récupérer tous les textes d'un workspace
   */
  static async getTexts(workspaceId: string): Promise<TextType[]> {
    try {
      const response = await callSecuredFunction<FirebaseResponse<{ texts: TextType[] }>>(
        'getTexts',
        workspaceId
      );
      
      // Vérifier si la réponse est une erreur
      if (!response || 'success' in response && response.success === false) {
        const errorResponse = response as ErrorResponse;
        throw new Error(errorResponse.error?.message || 'Erreur lors de la récupération des textes');
      }

      // Extraire les données de la réponse de succès
      const successResponse = response as SuccessResponse<{ texts: TextType[] }> & { texts: TextType[] };
      const textsData = successResponse.texts || [];
      
      // Convertir les dates string en Date si nécessaire
      return textsData.map((text) => ({
        ...text,
        created_at: typeof text.created_at === 'string' ? new Date(text.created_at) : text.created_at,
        updated_at: typeof text.updated_at === 'string' ? new Date(text.updated_at) : text.updated_at
      })) as TextType[];
    } catch (error) {
      throw error; // ✅ Rethrow pour gestion niveau hook
    }
  }

  /**
   * Supprimer un texte
   */
  static async deleteText(
    workspaceId: string,
    textId: string
  ): Promise<boolean> {
    try {
      const response = await callSecuredFunction<FirebaseResponse<{ deleted: boolean }>>(
        'deleteText',
        workspaceId,
        {
          textId
        }
      );
      
      // Vérifier si la réponse est une erreur
      if (!response || 'success' in response && response.success === false) {
        const errorResponse = response as ErrorResponse;
        throw new Error(errorResponse.error?.message || 'Erreur lors de la suppression du texte');
      }

      // Extraire les données de la réponse de succès
      const successResponse = response as SuccessResponse<{ deleted: boolean }> & { deleted: boolean };
      return successResponse.deleted ?? true;
    } catch (error) {
      throw error; // ✅ Rethrow pour gestion niveau hook
    }
  }

  /**
   * Mettre à jour un texte
   * ⚠️ Note: Cette fonction nécessite l'implémentation de `updateText` côté serveur
   */
  static async updateText(
    workspaceId: string,
    textId: string,
    data: Partial<{ title: string; content: string }>
  ): Promise<TextType> {
    try {
      // ⚠️ TODO: Implémenter la Firebase Function `updateText` côté serveur
      throw new Error('La fonction updateText n\'est pas encore implémentée côté serveur');
    } catch (error) {
      throw error; // ✅ Rethrow pour gestion niveau hook
    }
  }
}
