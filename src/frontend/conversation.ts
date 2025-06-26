import {
  AttachmentType,
  FileMetadata,
  RichContent,
  WhatsAppMessageContext,
  WhatsAppMessageStatus,
  WhatsAppPhoneNumber
} from './Whatsapp/whatsapp.js'
import { LoginPlatform } from './login.js'
import { FileInterface } from './file-interface.js'
import { PlanType } from './Payment/Model'
import { AITranslation } from './AI/Translation'

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
  informative = "informative"
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
  associatedTo: string
  associatedToCampaignId?: string
  messageDirection: MessageDirection

  hasReaction?: boolean
  hasAttachment?: boolean

  translation?: AITranslation

  agentIdentification?: AgentIdentification
  context?: WhatsAppMessageContext
  attachment?: FileMetadata
  attachmentBase64?: Base64Attachment
  reactions?: MessageReaction[]
  richContent?: RichContent

  tempAttachmentFile?: FileInterface

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
  profileImage: string | undefined
  customerName: string
  createdAt: number
  lastActiveAt: number
  email?: string
}

export interface ConversationTag {
  id: string
  title: string
  color: string
  associatedTo: string
  isSelected?: boolean
}

export type LanguageInformation = {
  languageCode: string
  targetCountryCode?: string // "he-IL"
  autoTranslate: boolean
}

export interface Conversation {
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
  unreadCount: number
  assignedTagIds?: string[]
  assignedAgentIds?: string[]

  aiContextLastMessageId?: string
  aiFeatures?: {
    autoTranslation?: LanguageInformation
  }

  statusCase: ConversationStatusCase
  answerMode: ConversationAnswerMode

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

  ai?: AISettings
}

export enum PlatformType {
  fireberry = 'powerlink',

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
  member = 'member',
  ai = 'ai'
}

export type UserSettings = {
  blurImages: boolean
}

export type UserPublicInformation = UserSchemaKeys & {
  name: string
  type: UserType
  profileImage?: string
  isConnected?: boolean
  connectedVia: LoginPlatform
  settings: UserSettings
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