import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';

/**
 * Service webhook Stripe
 * ✅ Conforme au pattern Agentova - onRequest pour webhooks externes
 */

/**
 * Webhook Stripe pour les événements de paiement
 */
export const stripeWebhook = onRequest({
  region: 'us-central1',
  memory: '512MiB',
  timeoutSeconds: 60,
  cors: true
}, async (request, response) => {
  try {
    // ✅ 1. Vérifier méthode HTTP
    if (request.method !== 'POST') {
      response.status(405).send('Method Not Allowed');
      return;
    }

    // ✅ 2. Validation signature Stripe (à implémenter)
    // const signature = request.headers['stripe-signature'];
    // if (!signature) {
    //   response.status(400).send('Missing signature');
    //   return;
    // }

    // ✅ 3. Traitement de l'événement
    const event = request.body;
    logger.info('Événement Stripe reçu', {
      type: event.type,
      id: event.id,
      action: 'stripe_webhook'
    });

    // ✅ 4. Réponse 200 immédiate (requirement webhooks)
    response.status(200).send('OK');

    // ✅ 5. Traitement asynchrone (à implémenter)
    // await processStripeEvent(event);

  } catch (error) {
    logger.error('Erreur dans stripeWebhook', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    // Toujours répondre 200 pour éviter retries Stripe
    response.status(200).send('OK');
  }
});
