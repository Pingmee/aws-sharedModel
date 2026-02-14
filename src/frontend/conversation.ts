import {
  AttachmentType,
  FileMetadata, SocialComment,
  RichContent,
  WhatsAppMessageContext,
  WhatsAppMessageStatus,
  WhatsAppPhoneNumber, WhatsAppErrorMessage
} from './Whatsapp/whatsapp.js'
import { LoginPlatform } from './login.js'
import { FileInterface } from './file-interface.js'
import { PlanType } from './Payment/Model'
import { AITranslation } from './AI/Translation'
import { WorkflowExecution } from './Automations/workflow'
import { SelectablePlatform } from './platforms'
import { FilterRule } from './Sorting'

export enum FilterOptionType {
  mine = 'mine',
  agentShared = 'agentShared',
  unassigned = 'unassigned',
  unread = 'unread',
  new = 'new',
  all = 'all'
}

export interface FilterOption {
  type: FilterOptionType,
  title: string,
  count: number,
  isSelected: boolean,
  showAlertIndicator: boolean
  condition: (conversation: Conversation) => boolean
}

export type ExtractedUserJWTPayload = {
  user: User
  iat: number;
  exp: number;
};

export type BaseMessageSchemeKeys = {
  messageId: string,
  createdAt: number
}

export enum MessageType {
  default = "default",
  deleted = 'deleted',
  informative = "informative",
  commentOnPost = "commentOnPost",
  privateReply = "privateReply",
  forward = "forward",
  aiSummary = "aiSummary",
  note = "note"
}

export enum Initiator {
  person = "person",
  bot = "bot",
  campaign = "campaign",
  ai = "ai"
}

export type AgentIdentification = {
  name: string,
  email: string
}

export type WhatsAppContact = {
  name: string
  phoneNumbers: {
    phone: string,
    wa_id: string,
  }[]
}

export enum InformativeMessageType {
  conversationStatusSwitched = 'conversationStatusSwitched',
  conversationModeSwitchedAfter24H = 'conversationModeSwitchedAfter24H',
  conversationModeSwitched = 'conversationModeSwitched'
}

export type Message = BaseMessageSchemeKeys & {
  sender: string
  receiver: string
  initiator: Initiator
  status: WhatsAppMessageStatus
  updatedAt: number
  participantsIdentifiers: string
  message: string
  type: MessageType
  messagePlatform: PlatformType
  creationPlatform: PlatformType
  associatedTo: string
  associatedToCampaignId?: string
  messageDirection: MessageDirection

  hasReaction?: boolean
  hasAttachment?: boolean

  translation?: AITranslation

  error?: WhatsAppErrorMessage
  agentIdentification?: AgentIdentification
  context?: WhatsAppMessageContext
  comment?: SocialComment
  attachment?: FileMetadata
  attachmentBase64?: Base64Attachment
  reactions?: MessageReaction[]
  richContent?: RichContent

  tempAttachmentFile?: FileInterface

  informativeMessageType?: InformativeMessageType

  // Used to track upload progress
  attachmentUploadProgress?: number

  // When we send a message we create a temp id, then replace it
  // with the real whatsapp id
  temporaryMessageId?: string
}

export interface MessagesDBScheme {
  phoneNumberId: string
  targetPhoneNumberId: string
  startKey: BaseMessageSchemeKeys | undefined,
  limit: number
}

export type ConnectedPhoneBaseInformation = {
  phoneNumbers?: DBObjectInterface<WhatsAppPhoneNumber[]>,
  conversations?: DBObjectInterface<Conversation[]>,
}

export interface Base64Attachment {
  resourceId: string
  fileName: string
  fileMimeType: string
  fileSize: number
  fileType: AttachmentType
}

export type BaseCustomerSchemeKeys = {
  phoneNumberId: string
  countryCode: string
  associatedTo: string

  parsedPhoneNumber?: string
}

export type Customer = BaseCustomerSchemeKeys & {
  profileImage: string | null
  customerName: string // The name from whatsapp
  customerNickname?: string // The name the business gave them
  createdAt: number
  lastActiveAt: number
  email?: string
  platform?: PlatformType.whatsapp | PlatformType.instagram | PlatformType.facebookMessenger
}

export interface ConversationTag {
  id: string
  title: string
  color: string
  associatedTo: string
  isSelected?: boolean
}

export interface ConversationStatus {
  id: string
  title: string
  color: string
  associatedTo: string
  isSelected?: boolean
}

export type AISummarizeData = {
  shouldSummarize: boolean
}

export type LanguageInformation = {
  languageCode: string
  targetCountryCode?: string // "he-IL"
  autoTranslate: boolean
}

export interface ConversationGroup {
  id: string
  name: string
}

export enum UpdateConversationAction {
  silenced,
  pinConversation,
  aiFeatures,
  unreadCount ,
  isOptoutFromMarketingMessages,
}

export interface UpdatableConversationKeys {
  silenced?: boolean

  //Pin Conversation
  pinnedByAgents?: string[]
  pinnedAt?: number

  aiFeatures?: {
    autoTranslation?: LanguageInformation
  }

  statusCase: ConversationStatusCase
  answerMode: ConversationAnswerMode
  unreadCount: number
  isOptoutFromMarketingMessages?: boolean
}

export interface Conversation extends  UpdatableConversationKeys {
  platformCompositionKey: string // whatsapp#<phoneNumber/page>Id

  associatedTo: string
  participantsIdentifiers: string // <phoneNumber/page>Id#customer<PhoneNumber/page>Id
  messages: Message[]
  lastMessage?: Message
  phoneNumberId: string
  messageWhatsAppId: string
  customerPhoneNumberId: string
  customer: Customer
  createdAt: number
  updatedAt: number
  assignedTagIds?: string[]
  assignedAgentIds?: string[]

  // Added for group chats
  group?: ConversationGroup

  // This id is set when a new execution is created
  lastWorkflowExecutionId?: string
  // This object is queried when fetching conversations
  lastWorkflowExecution?: WorkflowExecution

  ai?: {
    tokensUsed?: number
  }

  lastSendMessageFromUser?: number
  lastScrollViewPosition?: number
  hasMoreItemsToFetch?: boolean
  lastEvaluatedKey?: any
  isSelected?: boolean
}

export type AISettings = {
  tokens: number
  purchasedTokens: number
  overallTokens: number
  autoRenewable: boolean
  apiToken?: string
  baseInstructions?: string
}

export type StorageSettings = {
  maxSizeInBytes: number
  purchased: number
  size: number
}

export type BusinessSettings = {
  associatedTo: string
  name?: string
  imageUrl?: string
  isActive?: boolean

  subscription_id: string
  subscriptionStartDate?: number
  subscriptionEndDate?: number
  subscriptionPlan?: PlanType
  isPaymentYearly?: boolean

  industry?: string
  targetAudience?: string
  about?: string

  // Representative contact information
  phoneNumbers?: string[]
  emails?: string[]

  ai?: AISettings
  storage: StorageSettings
}

export enum PlatformType {
  fireberry = 'powerlink',
  greenAPI = 'greenAPI',
  whatsapp = 'whatsapp',
  facebookMessenger = 'facebookMessenger',
  pingmee = 'pingmee',
  instagram = 'instagram',
}

export type Platform = {
  id: string
  associatedTo: string
  type: PlatformType
  data: any
}

export type PlatformWhatsapp = {
  wa_business_name: string
  wa_token: string
  wa_business_id: string
  wa_phone_number_id: string
}

export type PlatformFireberry = {
  token: string
}

export type PlatformFacebookMessenger = {
  id: string
  name: string
  access_token: string,
  instagram_business_account_id?: string
  instagram_username?: string
}

export type UserSchemaKeys = {
  email: string
  associatedTo: string
}

export enum UserType {
  owner = 'owner',
  admin = 'admin',
  agent = 'agent', // can view all conversation associated to a platform
  member = 'member', // can view only conversation associated to a him
  ai = 'ai'
}

export enum UserPermission {
  all = 'all',
  conversationListAgents = 'conversationListAgents',
  messages = 'messages',
  contacts = 'contacts',
  aiAgents = 'aiAgents',
  workflows = 'workflows',
  campaigns = 'campaigns',
  templates = 'templates',
  integrations = 'integrations'
}

export enum UserStatus {
  active = 'active',
  inActive = 'inactive',
  invited = 'invited'
}

export interface OverviewBoardConfig {
  columnStatuses: string[]
  hiddenColumnStatuses?: string[]
}

export type UserSettings = {
  blurImages: boolean
  systemLanguage: string
  filterOptions?: UserFilterOptions
  overviewPagePreferences?: OverviewBoardConfig,
  finishedOnboarding: boolean
  // Should show the new overview page tutorial
  finishedOverview: boolean
}

export type UserFilterOptions = {
  conversation?: {
    defaultHeaderTab: FilterOptionType,
    rules: FilterRule[]
  }
}

export type UserPublicInformation = UserSchemaKeys & {
  name: string
  type: UserType
  status: UserStatus
  permissions: UserPermission[]
  platformAccess: SelectablePlatform[]
  profileImage?: string
  isConnected?: boolean
  connectedVia: LoginPlatform
  settings: UserSettings
  creationDate?: number
}

export type User = UserPublicInformation & {
  password: string
  morningUserId?: string
}

export type ActiveConnectionSchemeKeys = {
  connectionId: string;
  associatedTo: string
  associatedToAgent: string
  expiresAt: number
}

export enum MessageDirection {
  incoming = 'incoming',
  outgoing = 'outgoing'
}

export type MessageReaction = {
  id: string
  messagePlatform: PlatformType
  associatedToMessageId: string,
  emoji: string
  senderId: string
  receiver: string
  createdAt: number
}

export type InitialBaseInformation = {
  phoneNumbers?: DBObjectInterface<WhatsAppPhoneNumber[]>,
  connectedPlatforms?: Platform[],
  conversations?: DBObjectInterface<Conversation[]>,
  agents?: DBObjectInterface<UserPublicInformation[]>
  conversationTags?: DBObjectInterface<ConversationTag[]>
  conversationStatuses?: DBObjectInterface<ConversationStatus[]>
  businessSettings?: BusinessSettings,
  agentSettings?: UserSettings
}

export type DBObjectInterface<T> = {
  dbObject: T,
  hasMoreItemsToFetch: boolean,
  lastEvaluatedKey: Record<string, any> | undefined
}

export enum ConversationStatusCase {
  open = 'open',
  closed = 'closed',
  standby = 'standby'
}

export enum ConversationAnswerMode {
  bot = 'bot',
  manual = 'manual',
  ai = 'ai'
}

export type PingmeeToken = {
  associatedToAgent: string,
  associatedTo: string,
  token: string,
}