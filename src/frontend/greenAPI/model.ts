// =====================
// Shared Interfaces
// =====================

import { WhatsAppMessageStatus } from '../Whatsapp/whatsapp.js'

export enum TypeWebhook {
  outgoingMessageStatus = 'outgoingMessageStatus',
  incomingMessageReceived = 'incomingMessageReceived',
  outgoingMessageReceived = 'outgoingMessageReceived',
  outgoingAPIMessageReceived = 'outgoingAPIMessageReceived'
}

export enum TypeIncomingMessage {
  contactMessage = 'contactMessage',
  contactsArrayMessage = 'contactsArrayMessage',
  textMessage = 'textMessage',
  extendedTextMessage = 'extendedTextMessage',
  reactionMessage = 'reactionMessage',
  deletedMessage = 'deletedMessage',
  editedMessage = 'editedMessage',
  stickerMessage = 'stickerMessage',
  imageMessage = 'imageMessage',
  videoMessage = 'videoMessage',
  audioMessage = 'audioMessage',
  quotedMessage = 'quotedMessage',
  documentMessage = 'documentMessage',
  interactiveButtons = 'interactiveButtons',
  interactiveButtonsReply = 'interactiveButtonsReply',
  templateMessage = 'templateMessage',
  locationMessage = 'locationMessage',
  pollMessage = 'pollMessage',
  pollUpdateMessage = 'pollUpdateMessage',
  buttonsResponseMessage = 'buttonsResponseMessage',
  templateButtonsReplyMessage = 'templateButtonsReplyMessage',
  listResponseMessage = 'listResponseMessage',
  groupInviteMessage = 'groupInviteMessage',
}

export interface InstanceData {
  idInstance: number;
  wid: string;
  typeInstance: 'whatsapp';
}

// =====================
// outgoingMessageStatus
// =====================

export interface OutgoingMessageStatusWebhook {
  typeWebhook: 'outgoingMessageStatus';
  chatId: string;
  instanceData: InstanceData;
  timestamp: number;
  idMessage: string;
  status: WhatsAppMessageStatus;
  sendByApi: boolean;
}

// =====================
// outgoingMessageReceived
// =====================

export interface SenderData {
  chatId: string;
  chatName: string;
  sender: string;
  senderName: string;
  senderContactName: string;
}

export interface TextMessageData {
  textMessage: string;
}

export interface ExtendedTextMessageData {
  text: string;
  description?: string;
  title?: string;
  previewType?: string;
  jpegThumbnail?: string;
  forwardingScore?: number;
  isForwarded?: boolean;
}

export interface ReactionMessageData {
  text: string;
}

export interface FileMessageData {
  downloadUrl: string;
  caption?: string;
  fileName?: string;
  jpegThumbnail?: string;
  mimeType: string;
  forwardingScore?: number;
  isForwarded?: boolean;
  isAnimated?: boolean;
}

export interface ContactMessageData {
  displayName: string;
  vcard: string;
  forwardingScore?: number;
  isForwarded?: boolean;
}

export interface EditedMessageData {
  text?: string
  textMessage?: string;
  stanzaId: string;
}

export interface DeletedMessageData {
  stanzaId: string;
}

export interface QuotedMessageData {
  text?: string
  textMessage?: string
  stanzaId?: string;
  participant?: string;
  /** Green API type of the quoted message, for example `textMessage` or `imageMessage`. */
  typeMessage?: string
  caption?: string
  textMessageData?: { textMessage?: string }
  extendedTextMessageData?: { text?: string; stanzaId?: string }
  imageMessageData?: { caption?: string }
  videoMessageData?: { caption?: string }
  documentMessageData?: { caption?: string }
  fileMessageData?: { caption?: string }
}

export interface TemplateMessageData { titleText?: string, footerText?: string, contentText?: string }
export interface InteractiveButtonsData { header?: { type: string, parameters?: string[] }, body?: { text: string }, footer?: string, buttons?: { type: string, text: string }[] }

export interface LocationMessageData {
  nameLocation?: string
  address?: string
  jpegThumbnail?: string
  latitude: number
  longitude: number
  forwardingScore?: number
  isForwarded?: boolean
}

export interface ContactsArrayContact {
  displayName: string
  vcard: string
}

export interface ContactsArrayMessageData {
  contacts: ContactsArrayContact[]
  forwardingScore?: number
  isForwarded?: boolean
}

export interface PollOptionData {
  optionName: string
  optionVoters?: string[]
}

export interface PollMessageData {
  stanzaId?: string
  name: string
  options: PollOptionData[]
  multipleAnswers?: boolean
}

export interface ButtonsResponseMessageData {
  selectedButtonId: string
  selectedButtonText: string
  stanzaId?: string
}

export interface TemplateButtonsReplyMessageData {
  selectedIndex?: number | string
  selectedId: string
  selectedDisplayText: string
  stanzaId?: string
}

export interface ListResponseMessageData {
  title: string
  listType?: number | string
  singleSelectReply: string
  stanzaId?: string
}

export interface InteractiveButtonsReplyData {
  titleText?: string
  contentText?: string
  footerText?: string
  buttons?: { type: string, buttonId?: string, buttonText?: string, text?: string }[]
}

export interface GroupInviteMessageData {
  groupJid?: string
  inviteCode?: string
  inviteExpiration?: string
  groupName?: string
  caption?: string
  name?: string
  jpegThumbnail?: string
}

export interface MessageData {
  typeMessage: TypeIncomingMessage;

  textMessageData?: TextMessageData;
  extendedTextMessageData?: ExtendedTextMessageData | ReactionMessageData | QuotedMessageData;
  fileMessageData?: FileMessageData;
  contactMessageData?: ContactMessageData;
  contactsArrayMessageData?: ContactsArrayMessageData;
  /** Green API sometimes nests contacts under `messageData.contacts` or a nested `messageData`. */
  contacts?: ContactsArrayContact[];
  editedMessageData?: EditedMessageData;
  deletedMessageData?: DeletedMessageData;
  quotedMessage?: QuotedMessageData;
  templateMessageData?: TemplateMessageData;
  interactiveButtonsData?: InteractiveButtonsData;
  locationMessageData?: LocationMessageData;
  pollMessageData?: PollMessageData;
  buttonsResponseMessage?: ButtonsResponseMessageData;
  templateButtonReplyMessage?: TemplateButtonsReplyMessageData;
  listResponseMessage?: ListResponseMessageData;
  interactiveButtonsReply?: InteractiveButtonsReplyData;
  groupInviteMessageData?: GroupInviteMessageData;
}

export interface OutgoingMessageReceivedWebhook {
  typeWebhook: TypeWebhook
  instanceData: InstanceData;
  timestamp: number;
  idMessage: string;
  senderData: SenderData;
  messageData: MessageData;
}

// =====================
// Type Guards
// =====================

export function isOutgoingMessageStatusWebhook(obj: any): obj is OutgoingMessageStatusWebhook {
  return (
    obj?.typeWebhook === 'outgoingMessageStatus' &&
    typeof obj.chatId === 'string' &&
    typeof obj.idMessage === 'string' &&
    typeof obj.sendByApi === 'boolean'
  )
}

export function isOutgoingMessageReceivedWebhook(obj: any): obj is OutgoingMessageReceivedWebhook {
  return (
    [ TypeWebhook.incomingMessageReceived, TypeWebhook.outgoingAPIMessageReceived, TypeWebhook.outgoingMessageStatus, TypeWebhook.outgoingMessageReceived ].includes(obj.typeWebhook) &&
    typeof obj.idMessage === 'string' &&
    typeof obj.senderData?.sender === 'string' &&
    typeof obj.messageData?.typeMessage === 'string'
  )
}

export function isTextMessageWebhook(obj: any): obj is OutgoingMessageReceivedWebhook & {
  messageData: MessageData & { textMessageData: TextMessageData };
} {
  return (
    isOutgoingMessageReceivedWebhook(obj) &&
    obj.messageData.typeMessage === TypeIncomingMessage.textMessage &&
    typeof obj.messageData.textMessageData?.textMessage === 'string'
  )
}

export function isExtendedTextMessageWebhook(obj: any): obj is OutgoingMessageReceivedWebhook & {
  messageData: MessageData & { extendedTextMessageData: ExtendedTextMessageData };
} {
  return (
    isOutgoingMessageReceivedWebhook(obj) &&
    obj.messageData.typeMessage === TypeIncomingMessage.extendedTextMessage &&
    typeof obj.messageData.extendedTextMessageData?.text === 'string'
  )
}

export function isReactionMessageWebhook(obj: any): obj is OutgoingMessageReceivedWebhook & {
  messageData: MessageData & { extendedTextMessageData: ReactionMessageData, quotedMessageData: QuotedMessageData };
} {
  return (
    isOutgoingMessageReceivedWebhook(obj) &&
    obj.messageData.typeMessage === TypeIncomingMessage.reactionMessage &&
    typeof obj.messageData.extendedTextMessageData?.text === 'string'
  )
}

export function isImageMessageWebhook(obj: any): obj is OutgoingMessageReceivedWebhook & {
  messageData: MessageData & { fileMessageData: FileMessageData };
} {
  return (
    isOutgoingMessageReceivedWebhook(obj) &&
    obj.messageData.typeMessage === TypeIncomingMessage.imageMessage &&
    typeof obj.messageData.fileMessageData?.downloadUrl === 'string'
  )
}

export function isStickerMessageWebhook(obj: any): obj is OutgoingMessageReceivedWebhook & {
  messageData: MessageData & { fileMessageData: FileMessageData };
} {
  return (
    isOutgoingMessageReceivedWebhook(obj) &&
    obj.messageData.typeMessage === TypeIncomingMessage.stickerMessage &&
    typeof obj.messageData.fileMessageData?.downloadUrl === 'string'
  )
}

export function isContactMessageWebhook(obj: any): obj is OutgoingMessageReceivedWebhook & {
  messageData: MessageData & { contactMessageData: ContactMessageData };
} {
  return (
    isOutgoingMessageReceivedWebhook(obj) &&
    obj.messageData.typeMessage === TypeIncomingMessage.contactMessage &&
    typeof obj.messageData.contactMessageData?.vcard === 'string'
  )
}

export function isEditedMessageWebhook(obj: any): obj is OutgoingMessageReceivedWebhook & {
  messageData: MessageData & { editedMessageData: EditedMessageData };
} {
  return (
    isOutgoingMessageReceivedWebhook(obj) &&
    obj.messageData.typeMessage === TypeIncomingMessage.editedMessage &&
    typeof obj.messageData.editedMessageData?.stanzaId === 'string'
  )
}

export function isDeletedMessageWebhook(obj: any): obj is OutgoingMessageReceivedWebhook & {
  messageData: MessageData & { deletedMessageData: DeletedMessageData };
} {
  return (
    isOutgoingMessageReceivedWebhook(obj) &&
    obj.messageData.typeMessage === TypeIncomingMessage.deletedMessage &&
    typeof obj.messageData.deletedMessageData?.stanzaId === 'string'
  )
}