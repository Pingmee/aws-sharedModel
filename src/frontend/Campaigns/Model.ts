import { TemplateInformation } from '../Whatsapp/template-creation-model.js'
import { BaseSubFolder } from '../Automations/automations'
import { WhatsAppErrorMessage, WhatsAppMessageStatus } from '../Whatsapp/whatsapp'
import { ConversationTag, Customer, Message } from '../conversation'
import { FireberryQuery, FireberryTable, FireberryTableData } from './FireberryModel'

export enum TimeOption {
  now = 'now',
  future = 'future'
}

export enum AudienceSource {
  pingmeeTags = 'tags',
  fireberry = 'fireberry',
  excel = 'excel'
}

export type Campaign = BaseSubFolder & {
  description: string;
  message: Message;
  status: WhatsAppMessageStatus;
  whenToSendMessage: TimeOption
  source: AudienceSource

  conversationTags?: ConversationTag[]
  selectedFireberryTables?: FireberryTable[]
  selectedFireberryQueries?: FireberryQuery[]

  createdBy?: string;
  scheduledAt?: number; // Optional: Timestamp for scheduled execution
  startedAt?: number; // Optional: When campaign execution started
  completedAt?: number; // Optional: When campaign execution finished
  totalRecipients?: number;
  pendingCount?: number;
  sentCount?: number;
  deliveredCount?: number;
  readCount?: number;
  failedCount?: number;
  expiresAt?: number; // TTL attribute (optional, only if set)
};

export type CampaignRecipient = {
  campaignId: string; // Partition Key
  recipientPhoneNumberId: string; // Sort Key (phone number or user ID)
  conversationId: string
  status: WhatsAppMessageStatus;
  customer?: Customer
  sentAt?: number; // Optional timestamp when message was sent
  deliveredAt?: number; // Optional timestamp when message was delivered
  readAt?: number; // Optional timestamp when message was read
  failedAttempts?: number; // Number of retry attempts
  lastAttemptAt?: number; // Last retry attempt timestamp
  failureReason?: string; // Optional: Stores error messages for failed attemptse
  error?: WhatsAppErrorMessage
  expiresAt?: number; // TTL attribute (optional)
};