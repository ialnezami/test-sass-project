import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { validateAuth, verifyWorkspaceToken, isValidWorkspaceToken } from '../utils/authWorkspace.js';
import { validateRequiredFields, isSuccess, handleError } from '../utils/validation.js';
import { createResponseWithTokens } from '../../shared/responses.js';
import { getWorkspaceDocumentRepository } from '../../db/repositories/index.js';
import { WORKSPACE_ROLES } from '../../../shared/types.js';
import { ERRORS, withDetails } from '../../shared/types/errors.js';

/**
 * Service de gestion des documents
 * ✅ Conforme au pattern Agentova
 */

/**
 * Récupérer tous les documents d'un workspace
 */
export const getDocuments = onCall({
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
    const documents = await getWorkspaceDocumentRepository().getByWorkspace(workspace_id);

    // ✅ 6. Logging succès structuré
    logger.info('Documents récupérés avec succès', {
      workspace_id,
      user_id: uid,
      count: documents.length,
      action: 'get_documents'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ documents });
    
  } catch (error) {
    logger.error('Erreur dans getDocuments', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});

/**
 * Récupérer un document par ID
 */
export const getDocument = onCall({
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
    const { workspaceToken, documentId } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'documentId'
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
    const document = await getWorkspaceDocumentRepository().getById(documentId, workspace_id);

    if (!document) {
      return response.error(withDetails(ERRORS.NOT_FOUND, {
        message: 'Document non trouvé'
      }));
    }

    // ✅ 6. Logging succès structuré
    logger.info('Document récupéré avec succès', {
      document_id: documentId,
      workspace_id,
      user_id: uid,
      action: 'get_document'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ document });
    
  } catch (error) {
    logger.error('Erreur dans getDocument', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});
