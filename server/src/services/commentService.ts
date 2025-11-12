import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { validateAuth, verifyWorkspaceToken, isValidWorkspaceToken } from '../utils/authWorkspace.js';
import { validateRequiredFields, isSuccess, handleError } from '../utils/validation.js';
import { createResponseWithTokens } from '../../shared/responses.js';
import { getCommentRepository } from '../../db/repositories/index.js';
import { WORKSPACE_ROLES, CreateCommentType } from '../../../shared/types.js';
import { validateCommentData, validateCommentUpdate } from '../utils/validation/commentValidation.js';
import { ERRORS, withDetails } from '../../shared/types/errors.js';

/**
 * Service de gestion des commentaires
 * ✅ Service conforme à l'architecture Agentova
 */

/**
 * Créer un nouveau commentaire
 */
export const createComment = onCall({
  region: 'us-central1',
  memory: '512MiB',
  timeoutSeconds: 60
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken, text_id, content } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'text_id', 'content'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.EDITOR // Rôle requis pour créer des commentaires
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 4. Validation métier séparée
    const commentData: CreateCommentType = {
      text_id,
      content: content.trim(),
      created_by: uid
    };
    const commentValidation = validateCommentData(commentData);
    if (!commentValidation.valid) {
      return response.error(withDetails(ERRORS.INVALID_INPUT, {
        message: commentValidation.errors.join(', '),
        errors: commentValidation.errors,
        warnings: commentValidation.warnings
      }));
    }

    // ✅ 5. Logique métier via repository
    const newComment = await getCommentRepository().create(workspace_id, commentData);

    // ✅ 6. Logging succès structuré
    logger.info('Commentaire créé avec succès', {
      workspace_id,
      user_id: uid,
      comment_id: newComment.id,
      text_id,
      action: 'create_comment'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ comment: newComment });
    
  } catch (error) {
    logger.error('Erreur dans createComment', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        workspace_id: request.data?.workspaceToken ? 'present' : 'missing',
        has_text_id: !!request.data?.text_id,
        has_content: !!request.data?.content
      }
    });
    return handleError(error);
  }
});

/**
 * Récupérer tous les commentaires d'un workspace
 */
export const getComments = onCall({
  region: 'us-central1',
  memory: '512MiB',
  timeoutSeconds: 60
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken, text_id } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.EDITOR // Rôle requis pour lire les commentaires
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 5. Logique métier via repository
    let comments;
    if (text_id) {
      // Filtrer par text_id si fourni
      comments = await getCommentRepository().getByTextId(text_id, workspace_id);
    } else {
      // Récupérer tous les commentaires du workspace
      comments = await getCommentRepository().getByWorkspace(workspace_id);
    }

    // ✅ 6. Logging succès structuré
    logger.info('Commentaires récupérés avec succès', {
      workspace_id,
      user_id: uid,
      count: comments.length,
      filtered_by_text: !!text_id,
      action: 'get_comments'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ comments });
    
  } catch (error) {
    logger.error('Erreur dans getComments', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        workspace_id: request.data?.workspaceToken ? 'present' : 'missing',
        text_id: request.data?.text_id
      }
    });
    return handleError(error);
  }
});

/**
 * Mettre à jour un commentaire
 */
export const updateComment = onCall({
  region: 'us-central1',
  memory: '512MiB',
  timeoutSeconds: 60
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken, commentId, content } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'commentId', 'content'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.EDITOR // Rôle requis pour mettre à jour des commentaires
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 4. Récupérer le commentaire existant
    const existingComment = await getCommentRepository().getById(commentId, workspace_id);
    if (!existingComment) {
      return response.error(withDetails(ERRORS.NOT_FOUND, {
        message: 'Commentaire non trouvé'
      }));
    }

    // ✅ 5. Validation métier séparée
    const updateData = { content: content.trim() };
    const commentValidation = validateCommentUpdate(existingComment, updateData);
    if (!commentValidation.valid) {
      return response.error(withDetails(ERRORS.INVALID_INPUT, {
        message: commentValidation.errors.join(', '),
        errors: commentValidation.errors,
        warnings: commentValidation.warnings
      }));
    }

    // ✅ 6. Logique métier via repository
    const updatedComment = await getCommentRepository().update(commentId, workspace_id, updateData);
    
    if (!updatedComment) {
      return response.error(withDetails(ERRORS.NOT_FOUND, {
        message: 'Commentaire non trouvé'
      }));
    }

    // ✅ 7. Logging succès structuré
    logger.info('Commentaire mis à jour avec succès', {
      workspace_id,
      user_id: uid,
      comment_id: commentId,
      action: 'update_comment'
    });

    // ✅ 8. Réponse standardisée
    return response.success({ comment: updatedComment });
    
  } catch (error) {
    logger.error('Erreur dans updateComment', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        workspace_id: request.data?.workspaceToken ? 'present' : 'missing',
        comment_id: request.data?.commentId
      }
    });
    return handleError(error);
  }
});

/**
 * Supprimer un commentaire
 */
export const deleteComment = onCall({
  region: 'us-central1',
  memory: '512MiB',
  timeoutSeconds: 60
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken, commentId } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'commentId'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.ADMIN // Rôle requis pour supprimer des commentaires
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 5. Logique métier via repository
    const deleted = await getCommentRepository().delete(commentId, workspace_id);
    
    if (!deleted) {
      return response.error(withDetails(ERRORS.NOT_FOUND, {
        message: 'Commentaire non trouvé'
      }));
    }

    // ✅ 6. Logging succès structuré
    logger.info('Commentaire supprimé avec succès', {
      workspace_id,
      user_id: uid,
      comment_id: commentId,
      action: 'delete_comment'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ deleted: true });
    
  } catch (error) {
    logger.error('Erreur dans deleteComment', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        workspace_id: request.data?.workspaceToken ? 'present' : 'missing',
        comment_id: request.data?.commentId
      }
    });
    return handleError(error);
  }
});

