import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { validateAuth, verifyWorkspaceToken, isValidWorkspaceToken } from '../utils/authWorkspace.js';
import { validateRequiredFields, isSuccess, handleError } from '../utils/validation.js';
import { createResponseWithTokens } from '../../shared/responses.js';
import { getCustomAgentNotificationRepository } from '../../db/repositories/index.js';
import { WORKSPACE_ROLES } from '../../../shared/types.js';

/**
 * Service de gestion des notifications d'agents personnalisés
 * ✅ Conforme au pattern Agentova
 */

/**
 * Récupérer les notifications d'un agent personnalisé
 */
export const getCustomAgentNotifications = onCall({
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
    const { workspaceToken, customAgentId } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'customAgentId'
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
    const notifications = await getCustomAgentNotificationRepository().getByCustomAgent(customAgentId, workspace_id);

    // ✅ 6. Logging succès structuré
    logger.info('Notifications récupérées avec succès', {
      workspace_id,
      custom_agent_id: customAgentId,
      user_id: uid,
      count: notifications.length,
      action: 'get_custom_agent_notifications'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ notifications });
    
  } catch (error) {
    logger.error('Erreur dans getCustomAgentNotifications', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});
