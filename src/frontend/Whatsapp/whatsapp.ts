import { Message } from '../conversation.js'
import { TemplateInformation } from './template-creation-model.js'

export enum WhatsAppMessageStatus {
  pending = "pending",
  failed = "failed",
  sent = "sent",
  delivered = "delivered",
  read = "read"
}

export interface FileMetadata {
  messageId?: string;
  name?: string;
  mime_type: string;
  file_size: number;
  type: WhatsAppAttachmentType;
  url: string;
}

export type WhatsAppAttachmentURL = FileMetadata & {
  sha256: string;
  id: string;
  messaging_product: string;
  participantsIdentifiers: string;
}

export enum WhatsAppAttachmentType {
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


export interface RichContent {
  type: TemplateType
  content: {
    templateInformation?: TemplateInformation
    templateData?: TemplateData
    interactiveButtonData?: InteractiveButtonData
    interactiveListData?: InteractiveListData
  }
}

export interface TemplateData {
  header?: {
    type: WhatsAppHeaderComponentType
    url?: string
    parameters?: string[]
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
  text = 'text'
}


export interface WhatsAppPhoneNumber {
  id: string
  associatedTo: string
  userExtensionSettingsId: string
  verified_name: string
  code_verification_status: string
  display_phone_number: string
  quality_rating: string
  platform_type: string
  throughput: {
    "level": string
  },
  webhook_configuration: {
    "application": string
  }
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
  copy_code = 'copy_code'
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