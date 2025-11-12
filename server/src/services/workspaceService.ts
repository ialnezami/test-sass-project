import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { validateAuth, verifyWorkspaceToken, isValidWorkspaceToken } from '../utils/authWorkspace.js';
import { validateRequiredFields, isSuccess, handleError } from '../utils/validation.js';
import { createResponseWithTokens } from '../../shared/responses.js';
import { getWorkspaceRepository } from '../../db/repositories/index.js';
import { WORKSPACE_ROLES } from '../../../shared/types.js';
import { ERRORS, withDetails } from '../../shared/types/errors.js';

/**
 * Service de gestion des workspaces
 * ✅ Conforme au pattern Agentova
 */

/**
 * Récupérer tous les workspaces d'un utilisateur
 */
export const getWorkspaces = onCall({
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

    // ✅ 5. Logique métier via repository
    // Note: Repository placeholder - à implémenter
    const workspaces = await getWorkspaceRepository().getByUser(uid);

    // ✅ 6. Logging succès structuré
    logger.info('Workspaces récupérés avec succès', {
      user_id: uid,
      count: workspaces.length,
      action: 'get_workspaces'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ workspaces });
    
  } catch (error) {
    logger.error('Erreur dans getWorkspaces', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});

/**
 * Récupérer un workspace par ID
 */
export const getWorkspace = onCall({
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
    const { workspaceToken, workspaceId } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'workspaceId'
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
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 5. Logique métier via repository
    const workspace = await getWorkspaceRepository().getById(workspaceId, workspace_id);

    if (!workspace) {
      return response.error(withDetails(ERRORS.NOT_FOUND, {
        message: 'Workspace non trouvé'
      }));
    }

    // ✅ 6. Logging succès structuré
    logger.info('Workspace récupéré avec succès', {
      workspace_id: workspaceId,
      user_id: uid,
      action: 'get_workspace'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ workspace });
    
  } catch (error) {
    logger.error('Erreur dans getWorkspace', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});
