import { callSecuredFunction } from '@/services/local/authenticationService';
import { CommentType, CreateCommentType } from '@shared/types';

/**
 * Service de gestion des commentaires côté client
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

export class CommentService {
  /**
   * Créer un nouveau commentaire
   */
  static async createComment(
    workspaceId: string,
    data: CreateCommentType
  ): Promise<CommentType> {
    try {
      const response = await callSecuredFunction<FirebaseResponse<{ comment: CommentType }>>(
        'createComment',
        workspaceId,
        {
          text_id: data.text_id,
          content: data.content
        }
      );
      
      // Vérifier si la réponse est une erreur
      if (!response || 'success' in response && response.success === false) {
        const errorResponse = response as ErrorResponse;
        throw new Error(errorResponse.error?.message || 'Erreur lors de la création du commentaire');
      }

      // Extraire les données de la réponse de succès
      const successResponse = response as SuccessResponse<{ comment: CommentType }> & { comment: CommentType };
      const commentData = successResponse.comment;
      
      // Convertir les dates string en Date si nécessaire
      return {
        ...commentData,
        created_at: typeof commentData.created_at === 'string' ? new Date(commentData.created_at) : commentData.created_at,
        updated_at: typeof commentData.updated_at === 'string' ? new Date(commentData.updated_at) : commentData.updated_at
      } as CommentType;
    } catch (error) {
      throw error; // ✅ Rethrow pour gestion niveau hook
    }
  }

  /**
   * Récupérer tous les commentaires d'un workspace
   */
  static async getComments(workspaceId: string, textId?: string): Promise<CommentType[]> {
    try {
      const response = await callSecuredFunction<FirebaseResponse<{ comments: CommentType[] }>>(
        'getComments',
        workspaceId,
        textId ? { text_id: textId } : {}
      );
      
      // Vérifier si la réponse est une erreur
      if (!response || 'success' in response && response.success === false) {
        const errorResponse = response as ErrorResponse;
        throw new Error(errorResponse.error?.message || 'Erreur lors de la récupération des commentaires');
      }

      // Extraire les données de la réponse de succès
      const successResponse = response as SuccessResponse<{ comments: CommentType[] }> & { comments: CommentType[] };
      const commentsData = successResponse.comments || [];
      
      // Convertir les dates string en Date si nécessaire
      return commentsData.map((comment) => ({
        ...comment,
        created_at: typeof comment.created_at === 'string' ? new Date(comment.created_at) : comment.created_at,
        updated_at: typeof comment.updated_at === 'string' ? new Date(comment.updated_at) : comment.updated_at
      })) as CommentType[];
    } catch (error) {
      throw error; // ✅ Rethrow pour gestion niveau hook
    }
  }

  /**
   * Mettre à jour un commentaire
   */
  static async updateComment(
    workspaceId: string,
    commentId: string,
    data: Partial<Pick<CreateCommentType, 'content'>>
  ): Promise<CommentType> {
    try {
      const response = await callSecuredFunction<FirebaseResponse<{ comment: CommentType }>>(
        'updateComment',
        workspaceId,
        {
          commentId,
          content: data.content
        }
      );
      
      // Vérifier si la réponse est une erreur
      if (!response || 'success' in response && response.success === false) {
        const errorResponse = response as ErrorResponse;
        throw new Error(errorResponse.error?.message || 'Erreur lors de la mise à jour du commentaire');
      }

      // Extraire les données de la réponse de succès
      const successResponse = response as SuccessResponse<{ comment: CommentType }> & { comment: CommentType };
      const commentData = successResponse.comment;
      
      // Convertir les dates string en Date si nécessaire
      return {
        ...commentData,
        created_at: typeof commentData.created_at === 'string' ? new Date(commentData.created_at) : commentData.created_at,
        updated_at: typeof commentData.updated_at === 'string' ? new Date(commentData.updated_at) : commentData.updated_at
      } as CommentType;
    } catch (error) {
      throw error; // ✅ Rethrow pour gestion niveau hook
    }
  }

  /**
   * Supprimer un commentaire
   */
  static async deleteComment(
    workspaceId: string,
    commentId: string
  ): Promise<boolean> {
    try {
      const response = await callSecuredFunction<FirebaseResponse<{ deleted: boolean }>>(
        'deleteComment',
        workspaceId,
        {
          commentId
        }
      );
      
      // Vérifier si la réponse est une erreur
      if (!response || 'success' in response && response.success === false) {
        const errorResponse = response as ErrorResponse;
        throw new Error(errorResponse.error?.message || 'Erreur lors de la suppression du commentaire');
      }

      // Extraire les données de la réponse de succès
      const successResponse = response as SuccessResponse<{ deleted: boolean }> & { deleted: boolean };
      return successResponse.deleted ?? true;
    } catch (error) {
      throw error; // ✅ Rethrow pour gestion niveau hook
    }
  }
}

