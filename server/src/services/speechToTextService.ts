import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { validateAuth, verifyWorkspaceToken, isValidWorkspaceToken } from '../utils/authWorkspace.js';
import { validateRequiredFields, isSuccess, handleError } from '../utils/validation.js';
import { createResponseWithTokens } from '../../shared/responses.js';
import { WORKSPACE_ROLES } from '../../../shared/types.js';
import { ERRORS, withDetails } from '../../shared/types/errors.js';

/**
 * Service de transcription vocale (Speech-to-Text)
 * ✅ Conforme au pattern Agentova
 */

/**
 * Transcrire un fichier audio en texte
 */
export const transcribeAudio = onCall({
  region: 'us-central1',
  memory: '512MiB',
  timeoutSeconds: 120
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken, audioUrl, language } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'audioUrl'
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
    if (!audioUrl || typeof audioUrl !== 'string') {
      return response.error(withDetails(ERRORS.INVALID_INPUT, {
        message: 'URL audio invalide'
      }));
    }

    // ✅ 5. Logique métier
    // Note: À implémenter avec Google Cloud Speech-to-Text API
    const transcription = {
      text: 'Transcription placeholder',
      confidence: 0.95,
      language: language || 'fr-FR'
    };

    // ✅ 6. Logging succès structuré
    logger.info('Audio transcrit avec succès', {
      workspace_id,
      user_id: uid,
      action: 'transcribe_audio'
    });

    // ✅ 7. Réponse standardisée
    return response.success({ transcription });
    
  } catch (error) {
    logger.error('Erreur dans transcribeAudio', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return handleError(error);
  }
});
