import {
  RichContent,
  WhatsAppAttachmentType,
  WhatsAppAttachmentURL,
  WhatsAppMessageContext,
  WhatsAppMessageStatus,
  WhatsAppPhoneNumber
} from './Whatsapp/whatsapp.js'
import { LoginPlatform } from './login.js'
import { FileInterface } from './file-interface.js'

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
  bot = "bot"
}

export type AgentIdentification = {
  name: string,
  email: string
}

export type Message = BaseMessageSchemeKeys & {
  messageId: string
  sender: string
  receiver: string
  initiator: Initiator
  status: WhatsAppMessageStatus
  updatedAt: number
  participantsIdentifiers: string
  message: string
  type: MessageType
  associatedTo: string
  messageDirection: MessageDirection

  hasReaction?: boolean
  hasAttachment?: boolean

  agentIdentification?: AgentIdentification
  context?: WhatsAppMessageContext
  attachment?: WhatsAppAttachmentURL
  attachmentBase64?: Base64Attachment
  reactions?: MessageReaction[]
  richContent?: RichContent

  tempAttachmentFile?: FileInterface
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
  whatsappId: string
  fileName: string
  fileMimeType: string
  fileSize: number
  fileType: WhatsAppAttachmentType
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

export interface Conversation {
  associatedTo: string
  participantsIdentifiers: string
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

  statusCase: ConversationStatusCase
  answerMode: ConversationAnswerMode

  lastSendMessageFromUser?: number
  lastScrollViewPosition?: number
  hasMoreItemsToFetch?: boolean
  lastEvaluatedKey?: any
  isSelected?: boolean
}

export type BusinessSettings = {
  associatedTo: string
  subscription_id: string
  name?: string
  imageUrl?: string
  isActive?: boolean
  subscriptionStartDate?: number
}

export enum PlatformType {
  whatsapp = 'whatsapp',
  powerlink = 'powerlink'
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

export type PlatformPowerlink = {
  wa_token: string
}

export type UserSchemaKeys = {
  email: string
  associatedTo: string
}

export enum UserType {
  owner = 'owner',
  admin = 'admin',
  member = 'member'
}

export type UserPublicInformation = UserSchemaKeys & {
  name: string
  type: UserType
  profileImage?: string
  isConnected?: boolean
  connectedVia: LoginPlatform
}

export type User = UserPublicInformation & {
  password: string
  morningUserId?: string
}

export type ActiveConnectionSchemeKeys = {
  connectionId: string;
  associatedTo: string
  associatedToAgent: string
}

export enum MessageDirection {
  incoming = 'incoming',
  outgoing = 'outgoing'
}

export type MessageReaction = {
  id: string
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