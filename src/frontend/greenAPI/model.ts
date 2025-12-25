// =====================
// Shared Interfaces
// =====================

import { WhatsAppMessageStatus } from '../Whatsapp/whatsapp.js'

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

export interface MessageData {
  typeMessage: 'textMessage';
  textMessageData: TextMessageData;
}

export interface OutgoingMessageReceivedWebhook {
  typeWebhook: 'outgoingMessageReceived';
  instanceData: InstanceData;
  timestamp: number;
  idMessage: string;
  senderData: SenderData;
  messageData: MessageData;
}

// =====================
// Type Guards
// =====================

export function isOutgoingMessageStatusWebhook(
  obj: any
): obj is OutgoingMessageStatusWebhook {
  return (
    obj?.typeWebhook === 'outgoingMessageStatus' &&
    typeof obj.chatId === 'string' &&
    typeof obj.idMessage === 'string' &&
    typeof obj.sendByApi === 'boolean'
  );
}

export function isOutgoingMessageReceivedWebhook(
  obj: any
): obj is OutgoingMessageReceivedWebhook {
  return (
    (obj?.typeWebhook === 'outgoingMessageReceived' || obj?.typeWebhook === 'incomingMessageReceived') &&
    typeof obj.idMessage === 'string' &&
    typeof obj.senderData?.sender === 'string' &&
    typeof obj.messageData?.typeMessage === 'string'
  );
}