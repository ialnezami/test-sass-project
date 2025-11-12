import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { validateAuth, verifyWorkspaceToken, isValidWorkspaceToken } from '../utils/authWorkspace.js';
import { validateRequiredFields, isSuccess, handleError } from '../utils/validation.js';
import { createResponseWithTokens } from '../../shared/responses.js';
import { getTextRepository } from '../../db/repositories/index.js';
import { WORKSPACE_ROLES, CreateTextType } from '../../../shared/types.js';
import { validateTextData } from '../utils/validation/textValidation.js';
import { ERRORS, withDetails } from '../../shared/types/errors.js';

/**
 * Service de gestion des textes
 * 🔧 VERSION DEMO - Service de test pour enregistrer et récupérer des textes
 */

/**
 * Créer un nouveau texte
 */
export const createText = onCall({
  memory: '512MiB',
  timeoutSeconds: 60
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken, content, title } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'content'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.EDITOR // Rôle requis pour créer des textes
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 4. Validation métier séparée
    const textValidation = validateTextData({ title, content });
    if (!textValidation.valid) {
      return response.error(withDetails(ERRORS.INVALID_INPUT, {
        message: textValidation.errors.join(', '),
        errors: textValidation.errors,
        warnings: textValidation.warnings
      }));
    }

    // ✅ 5. Logique métier via repository
    const textData: CreateTextType = {
      content: content.trim(),
      title: title?.trim() || 'Sans titre',
      created_by: uid
    };
    
    const newText = await getTextRepository().create(workspace_id, textData);

    // ✅ 6. Logging succès structuré
    logger.info('Texte créé avec succès', {
      workspace_id,
      user_id: uid,
      text_id: newText.id,
      action: 'create_text'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ text: newText });
    
  } catch (error) {
    logger.error('Erreur dans createText', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        workspace_id: request.data?.workspaceToken ? 'present' : 'missing',
        has_content: !!request.data?.content
      }
    });
    return handleError(error);
  }
});

/**
 * Récupérer tous les textes d'un workspace
 */
export const getTexts = onCall({
  memory: '512MiB',
  timeoutSeconds: 60
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.EDITOR // Rôle requis pour lire les textes
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 5. Logique métier via repository
    const texts = await getTextRepository().getByWorkspace(workspace_id);

    // ✅ 6. Logging succès structuré
    logger.info('Textes récupérés avec succès', {
      workspace_id,
      user_id: uid,
      count: texts.length,
      action: 'get_texts'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ texts });
    
  } catch (error) {
    logger.error('Erreur dans getTexts', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        workspace_id: request.data?.workspaceToken ? 'present' : 'missing'
      }
    });
    return handleError(error);
  }
});

/**
 * Supprimer un texte
 */
export const deleteText = onCall({
  memory: '512MiB',
  timeoutSeconds: 60
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken, textId } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'textId'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.ADMIN // Rôle requis pour supprimer des textes
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 5. Logique métier via repository
    const deleted = await getTextRepository().delete(textId, workspace_id);
    
    if (!deleted) {
      return response.error(withDetails(ERRORS.NOT_FOUND, {
        message: 'Texte non trouvé'
      }));
    }

    // ✅ 6. Logging succès structuré
    logger.info('Texte supprimé avec succès', {
      workspace_id,
      user_id: uid,
      text_id: textId,
      action: 'delete_text'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ deleted: true });
    
  } catch (error) {
    logger.error('Erreur dans deleteText', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        workspace_id: request.data?.workspaceToken ? 'present' : 'missing',
        text_id: request.data?.textId
      }
    });
    return handleError(error);
  }
});

/**
 * Mettre à jour un texte
 */
export const updateText = onCall({
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
    const { workspaceToken, textId, title, content } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'textId'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.EDITOR // Rôle requis pour modifier des textes
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 4. Validation métier séparée
    // Vérifier que le texte existe et appartient au workspace
    const existingText = await getTextRepository().getById(textId, workspace_id);
    if (!existingText) {
      return response.error(withDetails(ERRORS.NOT_FOUND, {
        message: 'Texte non trouvé'
      }));
    }

    // Valider les nouvelles données si fournies
    const updateData: Partial<{ title: string; content: string }> = {};
    if (title !== undefined) {
      updateData.title = title?.trim() || 'Sans titre';
    }
    if (content !== undefined) {
      updateData.content = content.trim();
    }

    // Valider les données si du contenu est fourni
    if (updateData.content !== undefined || updateData.title !== undefined) {
      const textValidation = validateTextData({
        title: updateData.title || existingText.title,
        content: updateData.content || existingText.content
      });
      if (!textValidation.valid) {
        return response.error(withDetails(ERRORS.INVALID_INPUT, {
          message: textValidation.errors.join(', '),
          errors: textValidation.errors,
          warnings: textValidation.warnings
        }));
      }
    }

    // ✅ 5. Logique métier via repository
    const updatedText = await getTextRepository().update(textId, workspace_id, updateData);
    
    if (!updatedText) {
      return response.error(withDetails(ERRORS.NOT_FOUND, {
        message: 'Erreur lors de la mise à jour du texte'
      }));
    }

    // ✅ 6. Logging succès structuré
    logger.info('Texte mis à jour avec succès', {
      workspace_id,
      user_id: uid,
      text_id: textId,
      action: 'update_text'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ text: updatedText });
    
  } catch (error) {
    logger.error('Erreur dans updateText', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        workspace_id: request.data?.workspaceToken ? 'present' : 'missing',
        text_id: request.data?.textId
      }
    });
    return handleError(error);
  }
});
