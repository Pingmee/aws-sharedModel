import { Base64Attachment, Message, WhatsAppContact } from '../conversation.js'
import { TemplateInformation } from './template-creation-model.js'

export enum WhatsAppMessageStatus {
  pending = "pending",
  failed = "failed",
  sent = "sent",
  delivered = "delivered",
  read = "read",
  played = "played",
  standby = "standby",
  optOut = "optOut",
  tooManyRequests = "tooManyRequests"
}

export interface FileMetadata {
  messageId?: string;
  name?: string;
  mime_type: string;
  file_size: number;
  type: AttachmentType;
  url: string;
  participantsIdentifiers: string;

  // Primerly used by AI after it analyzed the image
  description?: string
}

export type WhatsAppAttachmentURL = FileMetadata & {
  sha256: string;
  id: string;
  messaging_product: string;
}

export enum AttachmentType {
  image = 'image',
  document = 'document',
  audio = 'audio',
  video = 'video',
  sticker = 'sticker',
  text = 'text',
  contacts = 'contacts',
  template = 'template',
  location = 'location',
  reaction = 'reaction'
}

export interface WhatsAppMessageContext {
  from: string
  id: string
  message?: Message
}

export interface SocialComment {
  commentId: string;
  parentId?: string;
  permalink?: string;
  username?: string
}

export type FacebookComment = SocialComment & {
  postId: string;
}

export type InstagramComment = SocialComment & {
  mediaProductType?: string;
  mediaId?: string
}

export type AdReferral = {
  source_url: string
  source_id: string
  source_type: 'ad' | 'post'
  body: string
  headline: string
  media_type: 'image' | 'video'
  video_url?: string
  image_url?: string
  thumbnail_url: string
  ctwa_clid: string
}

export type AISummary = {
  summary: string,
  issue: string,
  agentActions: string,
  status: string,
  steps: string[],
  tone: string
}

export interface RichContent {
  type: TemplateType
  content: {
    templateInformation?: TemplateInformation
    templateData?: TemplateData
    interactiveButtonData?: InteractiveButtonData
    interactiveListData?: InteractiveListData
    referral?: AdReferral
    contacts?: WhatsAppContact[]
    summary?: AISummary
  }
}

export interface TemplateData {
  header?: {
    type: WhatsAppHeaderComponentType
    url?: string
    parameters?: string[]
    text?: string
  },
  body: {
    parameters?: string[]
  },
  buttons?: {
    type: WhatsAppComponentButtonType,
    text: string
  }[]
}

export type InteractiveButton = {
  buttonTitle: string;
  buttonDescription: string;
}

export type InteractiveSectionButton = {
  sectionTitle: string;
  buttonInSection: {
    buttons: InteractiveButton[]
  }
}

export type InteractiveButtonData = {
  header?: InteractiveHeader
  body: {
    text: string
  }
  footer?: string
  buttons?: InteractiveButton[]
}

export type InteractiveHeader = {
  type: WhatsAppHeaderComponentType,
  text?: string,
  url?: string,
  parameters?: string[]

  s3AttachmentId?: string
}

export interface InteractiveListData {
  title: string
  header?: InteractiveHeader
  body: {
    text: string
  }
  footer?: string
  sections?: InteractiveSectionButton[]
}

export enum TemplateType {
  interactive = 'interactive',
  template = 'template',

  text = 'text',
  image = 'image',
  document = 'document',
  video = 'video',

  // Not a template
  referral = 'referral',
  contacts = 'contacts',
  aiSummary = 'aiSummary'
}


export interface FacebookPage {
  id: string
  associatedTo: string
  name: string
}

export enum WhatsAppCoexistenceSyncType {
  contacts = 'smb_app_state_sync',
  history = 'history'
}

export interface WhatsAppCoexistenceStatus {
  phase: number,
  chunk_order: number,
  progress: number,
  syncIds: {[key: string]: string}
  errors?: WhatsAppCoexistenceError[]
}

export interface WhatsAppCoexistenceError {
  code: number;
  title: string;
  message: string;
  error_data: {
    details: string;
  }
}

export interface WhatsAppPhoneNumber {
  id: string
  associatedTo: string
  associatedBusinessId: string // This is the Whatsapp Business Id
  userExtensionSettingsId: string
  verified_name: string
  code_verification_status: string
  display_phone_number: string
  quality_rating: string
  platform_type: string
  max_daily_conversations?: number
  throughput: {
    "level": string
  },
  webhook_configuration: {
    "application": string
  }
  isCoexistence?: boolean
  coexistenceOnboarding?: WhatsAppCoexistenceStatus
}

export interface WhatsAppErrorMessage {
  code: number;
  title: string;
  message: string;
  error_data: {
    details: string;
  };
}

export enum MessageTemplateType {
  whatsapp = 'whatsapp',
  company = 'company',
  private = 'private'
}

export enum TemplateRejectionReason {
  ABUSIVE_CONTENT = 'ABUSIVE_CONTENT',
  INVALID_FORMAT = 'INVALID_FORMAT',
  NONE = 'NONE',
  PROMOTIONAL = 'PROMOTIONAL',
  TAG_CONTENT_MISMATCH = 'TAG_CONTENT_MISMATCH',
  SCAM = 'SCAM'
}

export type ReplyButton = {
  id: string;
  title: string;
};

export type Row = {
  id: string;
  title: string;
  description: string;
};

export type Section = {
  title: string;
  rows: Row[];
};

export enum WhatsAppComponentButtonType {
  reply = "reply",
  url = "url",
  phone_number = "phone_number",
  quick_reply = 'quick_reply',
  copy_code = 'copy_code',
  catalog = 'catalog',
  multi_product = 'mpm'
}

export type Button = {
  type: WhatsAppComponentButtonType;
  text?: string
  reply?: ReplyButton;
  phone_number?: string;
  url?: string;
  example?: string[] | string
};

export type Action = {
  button: string;
  sections: Section[];
};

export enum WhatsAppComponentType {
  header = 'header',
  body = 'body',
  footer = 'footer',
  text = 'text',
  buttons = 'buttons',
  button = 'button'
}

export enum WhatsAppHeaderComponentType {
  none = 'none',
  text = 'text',
  image = 'image',
  video = 'video',
  document = 'document',
  location = 'location',
}

export enum WhatsAppMessageStatusNumber {
  pending,
  sent,
  delivered,
  read,
  played,
  failed,
}

export const getWhatsAppMessageStatusNumber = (status: string): WhatsAppMessageStatusNumber | undefined => {
  switch (status) {
    case WhatsAppMessageStatus.pending:
      return WhatsAppMessageStatusNumber.pending
    case WhatsAppMessageStatus.failed:
      return WhatsAppMessageStatusNumber.failed
    case WhatsAppMessageStatus.sent:
      return WhatsAppMessageStatusNumber.sent
    case WhatsAppMessageStatus.delivered:
      return WhatsAppMessageStatusNumber.delivered
    case WhatsAppMessageStatus.read:
      return WhatsAppMessageStatusNumber.read
  }
}

export type Header = {
  type: "text" | "image";
  text?: string;
  image?: {
    link: string;
  };
};

export type Footer = {
  text: string;
};

export enum SupportedMimeTypes {
  audioAac = "audio/aac",
  audioMp4 = "audio/mp4",
  audioMpeg = "audio/mpeg",
  audioAmr = "audio/amr",
  audioOgg = "audio/ogg",
  audioOpus = "audio/opus",

  applicationPowerpoint = "application/vnd.ms-powerpoint",
  applicationMSWord = "application/msword",
  applicationDocument = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  applicationPresentation = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  applicationSheet = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  applicationPdf = "application/pdf",
  applicationExcel = "application/vnd.ms-excel",

  textPlain = "text/plain",

  imageJpeg = "image/jpeg",
  imagePng = "image/png",
  imageWebp = "image/webp",

  videoMp4 = "video/mp4",
  video3gpp = "video/3gpp",
  videoQuicktime = 'video/quicktime',

  zip = 'application/zip'
}

export function attachmentTypeFromInfo(attachmentBase64: Base64Attachment) {
  const fileType = attachmentBase64.fileMimeType.split('/')[0]
  switch (fileType) {
    case 'application':
      return AttachmentType.document
    case 'video':
      return AttachmentType.video
    case 'audio':
      return AttachmentType.audio
    case 'image':
      return AttachmentType.image
  }
  return AttachmentType.text
}

export interface WhatsappManagerFields {
  about?: string,
  address?: string
  description?: string,
  email?: string,
  profile_picture_url?: string,
  // For image upload
  profile_picture_handle?: string,
  websites?: string[],
  vertical?: string,
  messaging_product: string
}