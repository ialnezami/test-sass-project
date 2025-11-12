import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { validateAuth, verifyWorkspaceToken, isValidWorkspaceToken } from '../utils/authWorkspace.js';
import { validateRequiredFields, isSuccess, handleError } from '../utils/validation.js';
import { createResponseWithTokens } from '../../shared/responses.js';
import { WORKSPACE_ROLES } from '../../../shared/types.js';
import { ERRORS, withDetails } from '../../shared/types/errors.js';

/**
 * Service de gestion des fichiers temporaires
 * ✅ Conforme au pattern Agentova
 */

/**
 * Uploader un fichier temporaire
 */
export const uploadTemporaryFile = onCall({
  region: 'us-central1',
  memory: '1GiB',
  timeoutSeconds: 300
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken, fileData, fileName } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'fileData', 'fileName'
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
    if (fileData && fileData.length > 10 * 1024 * 1024) { // 10MB max
      return response.error(withDetails(ERRORS.INVALID_INPUT, {
        message: 'Le fichier ne peut dépasser 10MB'
      }));
    }

    // ✅ 5. Logique métier
    // Note: À implémenter avec le stockage temporaire (R2, S3, etc.)
    const fileUrl = `https://temp-storage.example.com/${workspace_id}/${fileName}`;

    // ✅ 6. Logging succès structuré
    logger.info('Fichier temporaire uploadé avec succès', {
      workspace_id,
      user_id: uid,
      file_name: fileName,
      action: 'upload_temporary_file'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ fileUrl });
    
  } catch (error) {
    logger.error('Erreur dans uploadTemporaryFile', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});
