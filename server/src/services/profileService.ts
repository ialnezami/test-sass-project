import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { validateAuth, verifyWorkspaceToken, isValidWorkspaceToken } from '../utils/authWorkspace.js';
import { validateRequiredFields, isSuccess, handleError } from '../utils/validation.js';
import { createResponseWithTokens } from '../../shared/responses.js';
import { WORKSPACE_ROLES } from '../../../shared/types.js';
import { ERRORS, withDetails } from '../../shared/types/errors.js';

/**
 * Service de gestion des profils utilisateur
 * ✅ Conforme au pattern Agentova
 */

/**
 * Récupérer le profil de l'utilisateur
 */
export const getProfile = onCall({
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
    const { workspaceToken } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.EDITOR
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 5. Logique métier
    // Note: À implémenter avec la récupération du profil depuis la base de données
    const profile = {
      id: uid,
      email: 'demo@agentova.ai',
      displayName: 'Utilisateur Demo'
    };

    // ✅ 6. Logging succès structuré
    logger.info('Profil récupéré avec succès', {
      user_id: uid,
      action: 'get_profile'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ profile });
    
  } catch (error) {
    logger.error('Erreur dans getProfile', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});

/**
 * Mettre à jour le profil de l'utilisateur
 */
export const updateProfile = onCall({
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
    const { workspaceToken, displayName, email } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.EDITOR
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 4. Validation métier
    if (displayName && displayName.length > 100) {
      return response.error(withDetails(ERRORS.INVALID_INPUT, {
        message: 'Le nom d\'affichage ne peut dépasser 100 caractères'
      }));
    }

    // ✅ 5. Logique métier
    // Note: À implémenter avec la mise à jour du profil dans la base de données
    const updatedProfile = {
      id: uid,
      email: email || 'demo@agentova.ai',
      displayName: displayName || 'Utilisateur Demo'
    };

    // ✅ 6. Logging succès structuré
    logger.info('Profil mis à jour avec succès', {
      user_id: uid,
      action: 'update_profile'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ profile: updatedProfile });
    
  } catch (error) {
    logger.error('Erreur dans updateProfile', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});
