import { CommentType, CreateCommentType } from '../../../../shared/types.js';

/**
 * Validation métier pour les commentaires
 * ✅ Conforme au pattern de validation Agentova
 */

export interface CommentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Valide les données d'un nouveau commentaire
 */
export function validateCommentData(data: CreateCommentType): CommentValidationResult {
  const result: CommentValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };

  // Validation contenu obligatoire
  if (!data.content || data.content.trim().length === 0) {
    result.errors.push('Le contenu est requis');
    result.valid = false;
  }

  // Validation longueur contenu (max 2000 caractères)
  if (data.content && data.content.length > 2000) {
    result.errors.push('Le contenu ne peut dépasser 2000 caractères');
    result.valid = false;
  }

  // Validation text_id obligatoire
  if (!data.text_id || data.text_id.trim().length === 0) {
    result.errors.push('Le text_id est requis');
    result.valid = false;
  }

  // Avertissement pour contenu court
  if (data.content && data.content.trim().length < 3) {
    result.warnings.push('Le contenu est très court');
  }

  return result;
}

/**
 * Valide les données de mise à jour d'un commentaire
 */
export function validateCommentUpdate(
  existingComment: CommentType,
  updateData: Partial<Pick<CommentType, 'content'>>
): CommentValidationResult {
  const result: CommentValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };

  // Note: workspace_id et text_id ne peuvent pas être modifiés via cette fonction
  // car ils ne sont pas inclus dans le type updateData

  // Validation longueur contenu si fourni
  if (updateData.content !== undefined) {
    if (updateData.content.length > 2000) {
      result.errors.push('Le contenu ne peut dépasser 2000 caractères');
      result.valid = false;
    }
    if (updateData.content.trim().length === 0) {
      result.errors.push('Le contenu ne peut pas être vide');
      result.valid = false;
    }
    if (updateData.content.trim().length < 3) {
      result.warnings.push('Le contenu est très court');
    }
  }

  return result;
}

