import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { validateAuth, verifyWorkspaceToken, isValidWorkspaceToken } from '../utils/authWorkspace.js';
import { validateRequiredFields, isSuccess, handleError } from '../utils/validation.js';
import { createResponseWithTokens } from '../../shared/responses.js';
import { getCustomAgentRepository } from '../../db/repositories/index.js';
import { WORKSPACE_ROLES } from '../../../shared/types.js';
import { ERRORS, withDetails } from '../../shared/types/errors.js';

/**
 * Service de gestion des agents personnalisés
 * ✅ Conforme au pattern Agentova
 */

/**
 * Récupérer tous les agents personnalisés d'un workspace
 */
export const getCustomAgents = onCall({
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
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 5. Logique métier via repository
    const customAgents = await getCustomAgentRepository().getByWorkspace(workspace_id);

    // ✅ 6. Logging succès structuré
    logger.info('Agents personnalisés récupérés avec succès', {
      workspace_id,
      user_id: uid,
      count: customAgents.length,
      action: 'get_custom_agents'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ customAgents });
    
  } catch (error) {
    logger.error('Erreur dans getCustomAgents', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});

/**
 * Récupérer un agent personnalisé par ID
 */
export const getCustomAgent = onCall({
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
    const customAgent = await getCustomAgentRepository().getById(customAgentId, workspace_id);

    if (!customAgent) {
      return response.error(withDetails(ERRORS.NOT_FOUND, {
        message: 'Agent personnalisé non trouvé'
      }));
    }

    // ✅ 6. Logging succès structuré
    logger.info('Agent personnalisé récupéré avec succès', {
      custom_agent_id: customAgentId,
      workspace_id,
      user_id: uid,
      action: 'get_custom_agent'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ customAgent });
    
  } catch (error) {
    logger.error('Erreur dans getCustomAgent', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});
