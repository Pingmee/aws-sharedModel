import { WhatsAppHeaderComponentType, WhatsAppMessageStatus } from './whatsapp'
import { PlatformWhatsapp } from '../conversation'

export interface WhatsAppWebhookMediaMessage {
  object: string;
  entry: [
    {
      id: string;
      changes: [
        {
          value: {
            messaging_product: string;
            metadata: {
              display_phone_number: string;
              phone_number_id: string;
            };
            messages: [
              {
                from: string;
                id: string;
                timestamp: string;
                type: WhatsAppHeaderComponentType;
                image: {
                  caption?: string;
                  mime_type: string;
                  sha256: string;
                  id: string;
                };
              }
            ];
          };
          field: string;
        }
      ];
    }
  ];
}

export type HistoryMessageQueueData = HistoryMessage & {
  customerPhoneNumberId: string
  businessPhoneNumberId: string
  associatedTo: string
}

export type HistoryMediaMessageQueueData = HistoryMediaMessage & {
  associatedTo: string
  businessPhoneNumberId: string
  whatsappConnection: PlatformWhatsapp
}

export type HistoryMediaMessage = {
  from: string,
  id: string,
  timestamp: string,
  type: string,
  image?: {
    caption: string,
    mime_type: string,
    sha256: string,
    id: string
  }
  video?: {
    mime_type: string;
    sha256: string;
    id: string;
  }
  document?: {
    caption?: string;
    mime_type: string;
    sha256: string;
    id: string;
    filename?: string;
  }
  audio?: {
    mime_type: string;
    sha256: string;
    id: string;
  }
}

export type HistoryMessage = {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: {
    body: string;
  };
  history_context: {
    status: WhatsAppMessageStatus;
  };
}

export interface WhatsAppWebhookHistoryMessage {
  object: string;
  entry: [
    {
      id: string;
      changes: [
        {
          value: {
            messaging_product: string;
            metadata: {
              display_phone_number: string;
              phone_number_id: string;
            };
            history: [
              {
                metadata: {
                  phase: number;
                  chunk_order: number;
                  progress: number;
                };
                threads: [
                  {
                    id: string;
                    messages: HistoryMessage[];
                  }
                ];
              }
            ];
          };
          field: string;
        }
      ];
    }
  ];
}

export interface WhatsAppWebhookHistoryError {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  history: [
    {
      errors: [
        {
          code: number;
          title: string;
          message: string;
          error_data: {
            details: string;
          };
        }
      ];
    }
  ];
}


export function isWhatsAppWebhookMediaMessage(obj: any): obj is WhatsAppWebhookMediaMessage {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.object === 'string' &&
    Array.isArray(obj.entry) &&
    obj.entry[0]?.changes?.[0]?.field === 'history' &&
    Array.isArray(obj.entry[0].changes[0].value.messages)
  );
}

export function isWhatsAppWebhookHistoryMessage(obj: any): obj is WhatsAppWebhookHistoryMessage {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.object === 'string' &&
    Array.isArray(obj.entry) &&
    obj.entry[0]?.changes?.[0]?.field === 'history' &&
    Array.isArray(obj.entry[0].changes[0].value.history)
  );
}

export function isWhatsAppWebhookHistoryError(obj: any): obj is WhatsAppWebhookHistoryError {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.messaging_product === 'string' &&
    obj.history &&
    Array.isArray(obj.history) &&
    Array.isArray(obj.history[0]?.errors)
  );
}

export function isHistoryMessageQueueData(obj: any): obj is HistoryMessageQueueData {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.customerPhoneNumberId === 'string' &&
    typeof obj.businessPhoneNumberId === 'string' &&
    typeof obj.associatedTo === 'string' &&
    typeof obj.id === 'string' &&
    typeof obj.from === 'string' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.type === 'string'
  );
}

export function isHistoryMessageQueueDataArray(
  obj: any
): obj is HistoryMessageQueueData[] {
  return (
    Array.isArray(obj) &&
    obj.length > 0 &&
    isHistoryMessageQueueData(obj[0])
  );
}

export function isHistoryMediaMessageQueueData(obj: any): obj is HistoryMediaMessageQueueData {
  const baseValid =
    obj &&
    typeof obj === 'object' &&
    typeof obj.customerPhoneNumberId === 'string' &&
    typeof obj.businessPhoneNumberId === 'string' &&
    typeof obj.associatedTo === 'string' &&
    typeof obj.id === 'string' &&
    typeof obj.from === 'string' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.type === 'string';

  if (!baseValid) return false;

  // Validate based on media type
  switch (obj.type) {
    case 'image':
      return (
        obj.image &&
        typeof obj.image === 'object' &&
        typeof obj.image.mime_type === 'string' &&
        typeof obj.image.sha256 === 'string' &&
        typeof obj.image.id === 'string'
      );

    case 'video':
      return (
        obj.video &&
        typeof obj.video === 'object' &&
        typeof obj.video.mime_type === 'string' &&
        typeof obj.video.sha256 === 'string' &&
        typeof obj.video.id === 'string'
      );

    case 'document':
      return (
        obj.document &&
        typeof obj.document === 'object' &&
        typeof obj.document.mime_type === 'string' &&
        typeof obj.document.sha256 === 'string' &&
        typeof obj.document.id === 'string'
      );

    case 'audio':
      return (
        obj.audio &&
        typeof obj.audio === 'object' &&
        typeof obj.audio.mime_type === 'string' &&
        typeof obj.audio.sha256 === 'string' &&
        typeof obj.audio.id === 'string'
      );

    default:
      return false;
  }
}

export function isHistoryMediaMessageQueueDataArray(
  obj: any
): obj is HistoryMediaMessageQueueData[] {
  return (
    Array.isArray(obj) &&
    obj.length > 0 &&
    isHistoryMediaMessageQueueData(obj[0])
  );
}