// ✅ Importer main.ts en premier pour initialiser Firebase Admin
import './main';

export * from './services/oauthService';
export * from './utils/authWorkspace';
export * from './services/documentService';
export * from './services/profileService';
export * from './services/sessionService';
export * from './services/textService';
export * from './services/commentService';
export * from './services/customAgentService';
export * from './services/workspaceService';
export * from './services/imageGenerationService';
export * from './services/speechToTextService';
export * from './utils/wasabiStorage';
export * from './services/automationService';
export * from './utils/messageAutomation';
export * from './services/stripeWebhookService';
export * from './services/campaignService';
export * from './services/temporaryFileService';
export * from './services/replyCommentService';
export * from './services/leadService';
export * from './services/customAgentNotificationService';
//export * from './services/devService';

export * from './routes/customAgent';
export * from './routes/file';
export * from './routes/oauth';
export * from "./routes/webhooks";
//export * from './routes/debug';
export * from './triggers/auth';
export * from './triggers/socialScheduler';

