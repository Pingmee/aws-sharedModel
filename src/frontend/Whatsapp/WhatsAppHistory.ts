import { WhatsAppHeaderComponentType, WhatsAppMessageStatus } from './whatsapp.js'
import { PlatformWhatsapp } from '../conversation.js'

/** Media types accepted from coexistence history follow-up / echo webhooks. */
export const WHATSAPP_HISTORY_MEDIA_TYPES = [
  WhatsAppHeaderComponentType.image,
  WhatsAppHeaderComponentType.video,
  WhatsAppHeaderComponentType.document,
  'audio',
  'sticker',
] as const

export type WhatsAppHistoryMediaType = (typeof WHATSAPP_HISTORY_MEDIA_TYPES)[number]

export function isWhatsAppHistoryMediaType(type: unknown): type is WhatsAppHistoryMediaType {
  return typeof type === 'string' && (WHATSAPP_HISTORY_MEDIA_TYPES as readonly string[]).includes(type)
}

/** True when the payload looks like a media object Meta can follow up with (has an asset id). */
export function historyMediaPayloadHasAssetId(message: { type?: unknown } & Record<string, unknown>): boolean {
  if (typeof message?.type !== 'string' || !message.type) return false
  const payload = message[ message.type ]
  return Boolean(payload && typeof payload === 'object' && typeof (payload as { id?: unknown }).id === 'string')
}

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
                type: WhatsAppHeaderComponentType | string;
                image?: {
                  caption?: string;
                  mime_type: string;
                  sha256: string;
                  id: string;
                };
                video?: {
                  mime_type: string;
                  sha256: string;
                  id: string;
                };
                document?: {
                  caption?: string;
                  mime_type: string;
                  sha256: string;
                  id: string;
                  filename?: string;
                };
                audio?: {
                  mime_type: string;
                  sha256: string;
                  id: string;
                };
                sticker?: {
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

export type WhatsAppHistoryBaseMessage = {
  customerPhoneNumberId: string
  customerMetaUserId?: string
  businessPhoneNumberId: string
  /** E.164 display number from webhook metadata; history `from` uses this for business-sent messages. */
  businessDisplayPhoneNumber?: string
  associatedTo: string
}

export type WhatsAppHistoryStateSyncAction = 'add' | 'remove'

export type WhatsAppHistoryStateSyncQueueData = WhatsAppHistoryBaseMessage & {
  /** Omitted when Meta sends a contact `remove` (names are not included). */
  fullName?: string
  username?: string
  action: WhatsAppHistoryStateSyncAction
}

export type WhatsAppHistoryMessageQueueData = WhatsAppHistoryBaseMessage & WhatsAppHistoryMessage

export type WhatsAppHistoryMediaMessageQueueData = WhatsAppHistoryBaseMessage & WhatsAppHistoryMediaMessage & {
  whatsappConnection: PlatformWhatsapp
}

export type WhatsAppHistoryMessageEchoQueueData = WhatsAppHistoryMediaMessageQueueData & WhatsAppHistoryBaseMessage & {
  to: string
}

type HistoryMediaAsset = {
  caption?: string
  mime_type: string
  sha256: string
  id: string
  filename?: string
}

export type WhatsAppHistoryMediaMessage = {
  from: string,
  from_user_id?: string, // WhatsApp new BSUID user id of the sender
  id: string,
  timestamp: string,
  type: string,
  text?: {
    body: string
  }
  image?: HistoryMediaAsset
  video?: HistoryMediaAsset
  document?: HistoryMediaAsset
  audio?: HistoryMediaAsset
  sticker?: HistoryMediaAsset
  /** Unknown media type payload (generic follow-up). */
  [ key: string ]: unknown
}

export type WhatsAppHistoryMessageEcho = WhatsAppHistoryMediaMessage & {
  to: string
  to_user_id?: string
}

export type WhatsAppHistoryMessage = {
  from: string;
  from_user_id?: string
  id: string;
  timestamp: string;
  type: string;
  text?: {
    body: string;
  };
  history_context: {
    status: WhatsAppMessageStatus;
  };
  errors?: [
    {
      code: number,
      title: string,
      message: string,
      error_data: {
        details: string
      }
    }
  ]
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
                    context: {
                      user_id: string;
                      username: string;
                    }
                    messages: WhatsAppHistoryMessage[];
                  }
                ];
              }
            ];
          };
          field: "messages" | "history";
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

export interface WhatsAppWebhookStateSync {
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
            state_sync: Array<{
              type: "contact";
              contact: {
                user_id?: string;
                /** Not included when action is `remove`. */
                full_name?: string;
                /** Not included when action is `remove`. */
                first_name?: string;
                /** Omitted when the user's phone number is unavailable (BSUID-only). */
                phone_number?: string;
              };
              action: "add" | "remove" | string;
              metadata: {
                timestamp: string;
              };
            }>;
          };
          field: "smb_app_state_sync";
        }
      ];
    }
  ];
}

export type WhatsAppAccountUpdateEvent =
  | "PARTNER_APP_UNINSTALLED"
  | "PARTNER_REMOVED"
  | "ACCOUNT_OFFBOARDED"
  | "ACCOUNT_RECONNECTED"
  | string

export interface WhatsAppWebhookAccountUpdate {
  object: string;
  entry: [
    {
      id: string;
      time?: number;
      changes: [
        {
          field: "account_update";
          value: {
            event?: WhatsAppAccountUpdateEvent;
            /** Present on PARTNER_REMOVED (and some other) coexistence disconnect events. */
            phone_number?: string;
            disconnection_info?: {
              reason: string;
              initiated_by: string;
            };
            /** Present on PARTNER_APP_UNINSTALLED; may be absent on PARTNER_REMOVED. */
            waba_info?: {
              waba_id: string;
              owner_business_id?: string;
              partner_app_id?: string;
            };
            [ key: string ]: unknown
          };
        }
      ];
    }
  ];
}

export interface WhatsAppWebhookMessageEchoes {
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
            message_echoes: WhatsAppHistoryMessageEcho[];
          };
          field: "smb_message_echoes";
        }
      ];
    }
  ];
}

export function isHistoryWhatsAppWebhookStateSync(obj: any): obj is WhatsAppWebhookStateSync {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.object === 'string' &&
    Array.isArray(obj.entry) &&
    obj.entry[ 0 ]?.changes?.[ 0 ]?.field === 'smb_app_state_sync' &&
    Array.isArray(obj.entry[ 0 ].changes[ 0 ].value.state_sync)
  )
}

export function isHistoryWhatsAppWebhookMessageEchoes(obj: any): obj is WhatsAppWebhookMessageEchoes {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.object === 'string' &&
    Array.isArray(obj.entry) &&
    (obj.entry[ 0 ]?.changes?.[ 0 ]?.field === 'smb_message_echoes' || obj.entry[ 0 ]?.changes?.[ 0 ]?.field === 'history') &&
    Array.isArray(obj.entry[ 0 ].changes[ 0 ].value.message_echoes)
  )
}

export function isWhatsAppWebhookMediaMessage(obj: any): obj is WhatsAppWebhookMediaMessage {
  if (
    !obj ||
    typeof obj !== 'object' ||
    typeof obj.object !== 'string' ||
    !Array.isArray(obj.entry)
  ) {
    return false
  }
  const change = obj.entry[ 0 ]?.changes?.[ 0 ]
  if (
    !(change?.field === 'messages' || change?.field === 'history') ||
    !Array.isArray(change.value?.messages) ||
    !change.value.messages[ 0 ]?.type
  ) {
    return false
  }
  const message = change.value.messages[ 0 ]
  if (isWhatsAppHistoryMediaType(message.type)) {
    return true
  }
  // Generic media follow-up Meta may introduce later.
  return historyMediaPayloadHasAssetId(message)
}

/** True when a history[] item is a declined/error payload (no threads). */
export function historyChunkHasErrors(chunk: unknown): boolean {
  return Boolean(
    chunk
    && typeof chunk === 'object'
    && Array.isArray((chunk as { errors?: unknown }).errors)
    && (chunk as { errors: unknown[] }).errors.length > 0,
  )
}

export function isWhatsAppWebhookHistoryMessage(obj: any): obj is WhatsAppWebhookHistoryMessage {
  if (
    !obj ||
    typeof obj !== 'object' ||
    typeof obj.object !== 'string' ||
    !Array.isArray(obj.entry)
  ) {
    return false
  }
  const change = obj.entry[ 0 ]?.changes?.[ 0 ]
  if (change?.field !== 'history' || !Array.isArray(change.value?.history)) {
    return false
  }
  // Declined / error-only history must not match the thread handler.
  if (change.value.history.some((chunk: unknown) => historyChunkHasErrors(chunk))) {
    return false
  }
  return change.value.history.some(
    (chunk: unknown) => Array.isArray((chunk as { threads?: unknown }).threads),
  )
}

/**
 * History declined / error payloads.
 * Meta docs show an unwrapped root; live webhooks may also wrap it under entry/changes.
 */
export function isWhatsAppWebhookHistoryError(obj: any): obj is WhatsAppWebhookHistoryError {
  if (!obj || typeof obj !== 'object') {
    return false
  }

  // Unwrapped (Meta docs example for 2593109).
  if (
    typeof obj.messaging_product === 'string'
    && Array.isArray(obj.history)
    && historyChunkHasErrors(obj.history[ 0 ])
  ) {
    return true
  }

  // Wrapped under whatsapp_business_account → entry → changes → value.history[].errors
  if (
    typeof obj.object === 'string'
    && Array.isArray(obj.entry)
    && obj.entry[ 0 ]?.changes?.[ 0 ]?.field === 'history'
    && Array.isArray(obj.entry[ 0 ].changes[ 0 ].value?.history)
    && historyChunkHasErrors(obj.entry[ 0 ].changes[ 0 ].value.history[ 0 ])
  ) {
    return true
  }

  return false
}

/** Normalize unwrapped or wrapped history-error webhooks for the error handler. */
export function normalizeWhatsAppWebhookHistoryError(obj: any): WhatsAppWebhookHistoryError | null {
  if (!isWhatsAppWebhookHistoryError(obj)) {
    return null
  }
  if (typeof obj.messaging_product === 'string' && Array.isArray(obj.history) && obj.metadata) {
    return obj as WhatsAppWebhookHistoryError
  }
  const wrapped = obj as {
    entry?: Array<{ changes?: Array<{ value?: WhatsAppWebhookHistoryError & { messaging_product?: string } }> }>
  }
  const value = wrapped.entry?.[ 0 ]?.changes?.[ 0 ]?.value
  if (!value?.metadata || !Array.isArray(value.history)) {
    return null
  }
  return {
    messaging_product: value.messaging_product ?? 'whatsapp',
    metadata: value.metadata,
    history: value.history,
  }
}


export function isWhatsAppWebhookAccountUpdate(obj: any): obj is WhatsAppWebhookAccountUpdate {
  if (
    !obj ||
    typeof obj !== 'object' ||
    obj.object !== 'whatsapp_business_account' ||
    !Array.isArray(obj.entry)
  ) {
    return false
  }

  const entry = obj.entry[ 0 ]
  const change = entry?.changes?.[ 0 ]
  // Accept any account_update shape (with/without entry.time, waba_info, event_time, etc.).
  return (
    typeof entry?.id === 'string'
    && Array.isArray(entry?.changes)
    && change?.field === 'account_update'
  )
}


export function isHistoryMessageQueueData(obj: any): obj is WhatsAppHistoryMessageQueueData {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.customerPhoneNumberId === 'string' &&
    typeof obj.businessPhoneNumberId === 'string' &&
    typeof obj.associatedTo === 'string' &&
    typeof obj.from === 'string' &&
    typeof obj.id === 'string' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.type === 'string' &&
    obj.history_context &&
    typeof obj.history_context.status === 'string'
  )
}

function isValidMediaAsset(payload: unknown): boolean {
  return Boolean(
    payload
    && typeof payload === 'object'
    && typeof (payload as { mime_type?: unknown }).mime_type === 'string'
    && typeof (payload as { sha256?: unknown }).sha256 === 'string'
    && typeof (payload as { id?: unknown }).id === 'string',
  )
}

export function isHistoryMediaMessageQueueData(obj: any): obj is WhatsAppHistoryMediaMessageQueueData {
  const baseValid =
    obj &&
    typeof obj === 'object' &&
    typeof obj.businessPhoneNumberId === 'string' &&
    typeof obj.associatedTo === 'string' &&
    typeof obj.id === 'string' &&
    typeof obj.from === 'string' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.type === 'string'

  if (!baseValid) return false

  if (obj.type === 'text') {
    return obj.text && typeof obj.text.body === 'string'
  }

  if (isWhatsAppHistoryMediaType(obj.type)) {
    return isValidMediaAsset(obj[ obj.type ])
  }

  // Unknown media type with an asset id — accept so the worker can WARN + best-effort save.
  return historyMediaPayloadHasAssetId(obj)
}


export function isHistoryMessageQueueDataArray(obj: any): obj is WhatsAppHistoryMessageQueueData[] {
  return Array.isArray(obj) && obj.length > 0 && isHistoryMessageQueueData(obj[ 0 ])
}

export function isHistoryMediaMessageQueueDataArray(obj: any): obj is WhatsAppHistoryMediaMessageQueueData[] {
  return (
    Array.isArray(obj) &&
    obj.length > 0 &&
    isHistoryMediaMessageQueueData(obj[ 0 ])
  )
}

export function isHistoryMessageEchoesQueueDataArray(
  obj: any
): obj is WhatsAppHistoryMessageEchoQueueData[] {
  return (
    Array.isArray(obj) &&
    obj.length > 0 &&
    typeof obj[ 0 ]?.to === "string" &&
    typeof obj[ 0 ]?.from === "string" &&
    typeof obj[ 0 ]?.id === "string" &&
    typeof obj[ 0 ]?.timestamp === "string" &&
    typeof obj[ 0 ]?.type === "string" &&
    typeof obj[ 0 ]?.customerPhoneNumberId === "string" &&
    typeof obj[ 0 ]?.businessPhoneNumberId === "string" &&
    typeof obj[ 0 ]?.associatedTo === "string"
  )
}

export function isHistoryStateSyncQueueDataArray(obj: any): obj is WhatsAppHistoryStateSyncQueueData[] {
  return (
    Array.isArray(obj) &&
    obj.length > 0 &&
    typeof obj[ 0 ]?.businessPhoneNumberId === 'string' &&
    typeof obj[ 0 ]?.associatedTo === 'string' &&
    (
      typeof obj[ 0 ]?.customerPhoneNumberId === 'string'
      || typeof obj[ 0 ]?.customerMetaUserId === 'string'
    ) &&
    (
      obj[ 0 ]?.action === 'add' ||
      obj[ 0 ]?.action === 'remove' ||
      typeof obj[ 0 ]?.fullName === 'string'
    )
  )
}
