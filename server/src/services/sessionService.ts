import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { validateAuth, verifyWorkspaceToken, isValidWorkspaceToken } from '../utils/authWorkspace.js';
import { validateRequiredFields, isSuccess, handleError } from '../utils/validation.js';
import { createResponseWithTokens } from '../../shared/responses.js';
import { getSessionRepository } from '../../db/repositories/index.js';
import { WORKSPACE_ROLES } from '../../../shared/types.js';
import { ERRORS, withDetails } from '../../shared/types/errors.js';

/**
 * Service de gestion des sessions
 * ✅ Conforme au pattern Agentova
 */

/**
 * Récupérer toutes les sessions d'un workspace
 */
export const getSessions = onCall({
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
    const { workspaceToken, appName } = request.data;
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
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 5. Logique métier via repository
    const sessions = await getSessionRepository().getByWorkspace(workspace_id, appName);

    // ✅ 6. Logging succès structuré
    logger.info('Sessions récupérées avec succès', {
      workspace_id,
      user_id: uid,
      app_name: appName,
      count: sessions.length,
      action: 'get_sessions'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ sessions });
    
  } catch (error) {
    logger.error('Erreur dans getSessions', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});

/**
 * Récupérer une session par ID
 */
export const getSession = onCall({
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
    const { workspaceToken, sessionId } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'sessionId'
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
    const session = await getSessionRepository().getById(sessionId, workspace_id);

    if (!session) {
      return response.error(withDetails(ERRORS.NOT_FOUND, {
        message: 'Session non trouvée'
      }));
    }

    // ✅ 6. Logging succès structuré
    logger.info('Session récupérée avec succès', {
      session_id: sessionId,
      workspace_id,
      user_id: uid,
      action: 'get_session'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ session });
    
  } catch (error) {
    logger.error('Erreur dans getSession', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});

/**
 * Créer une nouvelle session
 */
export const createSession = onCall({
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
    const { workspaceToken, appName, title } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'appName'
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

    // ✅ 4. Validation métier
    if (title && title.length > 200) {
      return response.error(withDetails(ERRORS.INVALID_INPUT, {
        message: 'Le titre ne peut dépasser 200 caractères'
      }));
    }

    // ✅ 5. Logique métier via repository
    const sessionData = {
      app_name: appName,
      title: title || 'Nouvelle session',
      created_by: uid
    };
    const newSession = await getSessionRepository().create(workspace_id, sessionData);

    // ✅ 6. Logging succès structuré
    logger.info('Session créée avec succès', {
      workspace_id,
      user_id: uid,
      session_id: newSession.id,
      action: 'create_session'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ session: newSession });
    
  } catch (error) {
    logger.error('Erreur dans createSession', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});
