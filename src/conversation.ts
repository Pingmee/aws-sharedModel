import {
  RichContent,
  WhatsAppAttachmentURL,
  WhatsAppMessageContext,
  WhatsAppMessageStatus, WhatsAppPhoneNumber
} from './Whatsapp/whatsapp'
import { LoginPlatform } from './login'
import { FileInterface } from './file-interface'


export type BaseMessageSchemeKeys = {
  messageId: string,
  createdAt: number
}

export const enum MessageType {
  default = "default",
  informative = "informative"
}

export const enum Initiator {
  person = "person",
  bot = "bot"
}

export type AgentIdentification = {
  name: string,
  email: string
}

export type Message = BaseMessageSchemeKeys & {
  sender: string
  receiver: string
  initiator: Initiator
  status: WhatsAppMessageStatus
  message: string
  updatedAt: number
  participantsIdentifiers: string
  type: MessageType
  associatedTo: string
  hasAttachment?: boolean

  agentIdentification?: AgentIdentification
  context?: WhatsAppMessageContext
  attachment?: WhatsAppAttachmentURL
  attachmentBase64?: Base64Attachment
  reactions?: MessageReaction[]
  richContent?: RichContent

  tempAttachmentFile?: FileInterface
}

export interface Base64Attachment {
  whatsappId: string
  fileName: string
  fileMimeType: string
  fileSize: number
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

export const enum PlatformType {
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

export type User = {
  name: string
  email: string
  connectedVia: LoginPlatform
  profileImage?: string
  associatedTo: string
  isConnected?: boolean
}

export type ActiveConnectionSchemeKeys = {
  connectionId: string;
  associatedTo: string
  associatedToAgent: string
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
  phoneNumbers: DBObjectInterface<WhatsAppPhoneNumber[]>,
  connectedPlatforms?: Platform[],
  conversations: DBObjectInterface<Conversation[]>,
  agents: DBObjectInterface<User[]>
  conversationTags: DBObjectInterface<ConversationTag[]>
  businessSettings?: BusinessSettings,
}

export type DBObjectInterface<T> = {
  dbObject: T,
  hasMoreItemsToFetch: boolean,
  lastEvaluatedKey: Record<string, any> | undefined
}

export const enum ConversationStatusCase {
  open = 'open',
  closed = 'closed',
  standby = 'standby'
}

export const enum ConversationAnswerMode {
  bot = 'bot',
  manual = 'manual',
  ai = 'ai'
}

export type DeviceIdentity = {
  vendor?: string
  model?: string
  browser?: string
}

export type PingmeeToken = {
  associatedToAgent: string,
  associatedTo: string,
  token: string,
}