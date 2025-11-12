import { AutomationDiscussionRepository } from './automationDiscussionRepository';
import { AutomationRepository } from './automationRepository';
import { CampaignRepository } from './campaignRepository';
import { CustomAgentRepository } from './customAgentRepository';
import { CustomAgentNotificationRepository } from './customAgentNotificationRepository';
import { ImageGenerationRepository } from './imageGenerationRepository';
import { OAuthTokenRepository } from './oauthTokenRepository';
import { SessionRepository } from './sessionRepository';
import { WorkspaceDocumentRepository } from './workspaceDocumentRepository';
import { WorkspaceInvitationRepository } from './workspaceInvitationRepository';
import { WorkspaceRepository } from './workspaceRepository';
import { ReplyCommentRepository } from './replyCommentRepository';
import { LeadRepository } from './leadRepository';
import { InboxStatesRepository } from './inboxStatesRepository';
import { TextRepository } from './textRepository';
import { CommentRepository } from './commentRepository';

// Singleton instances - on les déclare comme undefined pour éviter l'initialisation au build
let automationDiscussionRepo: AutomationDiscussionRepository | undefined;
let automationRepo: AutomationRepository | undefined;
let campaignRepo: CampaignRepository | undefined;
let customAgentRepo: CustomAgentRepository | undefined;
let customAgentNotificationRepo: CustomAgentNotificationRepository | undefined;
let imageGenerationRepo: ImageGenerationRepository | undefined;
let oauthTokenRepo: OAuthTokenRepository | undefined;
let sessionRepo: SessionRepository | undefined;
let workspaceDocumentRepo: WorkspaceDocumentRepository | undefined;
let workspaceInvitationRepo: WorkspaceInvitationRepository | undefined;
let workspaceRepo: WorkspaceRepository | undefined;
let replyCommentRepository: ReplyCommentRepository | null = null;
let leadRepository: LeadRepository | undefined;
let inboxStatesRepo: InboxStatesRepository | undefined;
let textRepo: TextRepository | undefined;
let commentRepo: CommentRepository | undefined;

// Getters with lazy initialization
export function getAutomationDiscussionRepository(): AutomationDiscussionRepository {
  if (!automationDiscussionRepo) {
    automationDiscussionRepo = new AutomationDiscussionRepository();
  }
  return automationDiscussionRepo;
}

export function getAutomationRepository(): AutomationRepository {
  if (!automationRepo) {
    automationRepo = new AutomationRepository();
  }
  return automationRepo;
}

export function getCampaignRepository(): CampaignRepository {
  if (!campaignRepo) {
    campaignRepo = new CampaignRepository();
  }
  return campaignRepo;
}

export function getCustomAgentRepository(): CustomAgentRepository {
  if (!customAgentRepo) {
    customAgentRepo = new CustomAgentRepository();
  }
  return customAgentRepo;
}

export function getCustomAgentNotificationRepository(): CustomAgentNotificationRepository {
  if (!customAgentNotificationRepo) {
    customAgentNotificationRepo = new CustomAgentNotificationRepository();
  }
  return customAgentNotificationRepo;
}

export function getImageGenerationRepository(): ImageGenerationRepository {
  if (!imageGenerationRepo) {
    imageGenerationRepo = new ImageGenerationRepository();
  }
  return imageGenerationRepo;
}

export function getOAuthTokenRepository(): OAuthTokenRepository {
  if (!oauthTokenRepo) {
    oauthTokenRepo = new OAuthTokenRepository();
  }
  return oauthTokenRepo;
}

export function getSessionRepository(): SessionRepository {
  if (!sessionRepo) {
    sessionRepo = new SessionRepository();
  }
  return sessionRepo;
}

export function getWorkspaceDocumentRepository(): WorkspaceDocumentRepository {
  if (!workspaceDocumentRepo) {
    workspaceDocumentRepo = new WorkspaceDocumentRepository();
  }
  return workspaceDocumentRepo;
}

export function getWorkspaceInvitationRepository(): WorkspaceInvitationRepository {
  if (!workspaceInvitationRepo) {
    workspaceInvitationRepo = new WorkspaceInvitationRepository();
  }
  return workspaceInvitationRepo;
}

export function getWorkspaceRepository(): WorkspaceRepository {
  if (!workspaceRepo) {
    workspaceRepo = new WorkspaceRepository();
  }
  return workspaceRepo;
}

export function getReplyCommentRepository(): ReplyCommentRepository {
  if (!replyCommentRepository) {
    replyCommentRepository = new ReplyCommentRepository();
  }
  return replyCommentRepository;
}

export function getLeadRepository(): LeadRepository {
  if (!leadRepository) {
    leadRepository = new LeadRepository();
  }
  return leadRepository;
}

export function getInboxStatesRepository(): InboxStatesRepository {
  if (!inboxStatesRepo) {
    inboxStatesRepo = new InboxStatesRepository();
  }
  return inboxStatesRepo;
}

export function getTextRepository(): TextRepository {
  if (!textRepo) {
    textRepo = new TextRepository();
  }
  return textRepo;
}

export function getCommentRepository(): CommentRepository {
  if (!commentRepo) {
    commentRepo = new CommentRepository();
  }
  return commentRepo;
}

// Cleanup function for testing purposes
export function clearRepositories(): void {
  automationDiscussionRepo = undefined;
  automationRepo = undefined;
  campaignRepo = undefined;
  customAgentRepo = undefined;
  customAgentNotificationRepo = undefined;
  imageGenerationRepo = undefined;
  oauthTokenRepo = undefined;
  sessionRepo = undefined;
  workspaceDocumentRepo = undefined;
  workspaceInvitationRepo = undefined;
  workspaceRepo = undefined;
  replyCommentRepository = null;
  leadRepository = undefined;
  inboxStatesRepo = undefined;
  textRepo = undefined;
  commentRepo = undefined;
} 



