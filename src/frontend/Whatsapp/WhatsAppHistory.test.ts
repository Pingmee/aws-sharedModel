import { describe, expect, it } from '@jest/globals'
import {
  historyChunkHasErrors,
  isHistoryMediaMessageQueueData,
  isWhatsAppWebhookAccountUpdate,
  isWhatsAppWebhookHistoryError,
  isWhatsAppWebhookHistoryMessage,
  isWhatsAppWebhookMediaMessage,
  normalizeWhatsAppWebhookHistoryError,
} from './WhatsAppHistory.js'

describe('isWhatsAppWebhookMediaMessage', () => {
  function mediaWebhook(type: string, payload: Record<string, unknown>) {
    return {
      object: 'whatsapp_business_account',
      entry: [ {
        id: 'waba',
        changes: [ {
          field: 'history',
          value: {
            messaging_product: 'whatsapp',
            metadata: { display_phone_number: '1', phone_number_id: '2' },
            messages: [ {
              from: '16505551234',
              id: 'wamid.1',
              timestamp: '1',
              type,
              [ type ]: payload,
            } ],
          },
        } ],
      } ],
    }
  }

  it('accepts sticker follow-ups', () => {
    expect(isWhatsAppWebhookMediaMessage(mediaWebhook('sticker', {
      mime_type: 'image/webp',
      sha256: 'abc',
      id: 'media-1',
    }))).toBe(true)
  })

  it('accepts generic media payloads with an asset id', () => {
    expect(isWhatsAppWebhookMediaMessage(mediaWebhook('unknown_media', {
      mime_type: 'application/octet-stream',
      sha256: 'abc',
      id: 'media-2',
    }))).toBe(true)
  })
})

describe('isHistoryMediaMessageQueueData', () => {
  it('accepts sticker queue rows', () => {
    expect(isHistoryMediaMessageQueueData({
      associatedTo: 'ws',
      businessPhoneNumberId: 'biz',
      from: '16505551234',
      id: 'wamid.1',
      timestamp: '1',
      type: 'sticker',
      sticker: { mime_type: 'image/webp', sha256: 'x', id: 'm1' },
      whatsappConnection: {},
    })).toBe(true)
  })
})

describe('history declined guards', () => {
  const declinedErrors = [ {
    code: 2593109,
    title: 'History sync is turned off',
    message: 'History sync is turned off',
    error_data: { details: 'History sharing is turned off by the business' },
  } ]

  it('matches Meta unwrapped declined payload', () => {
    const payload = {
      messaging_product: 'whatsapp',
      metadata: { display_phone_number: '1', phone_number_id: '2' },
      history: [ { errors: declinedErrors } ],
    }
    expect(isWhatsAppWebhookHistoryError(payload)).toBe(true)
    expect(historyChunkHasErrors(payload.history[ 0 ])).toBe(true)
  })

  it('matches wrapped declined payload and does not treat it as threads history', () => {
    const payload = {
      object: 'whatsapp_business_account',
      entry: [ {
        id: 'waba',
        changes: [ {
          field: 'history',
          value: {
            messaging_product: 'whatsapp',
            metadata: { display_phone_number: '1', phone_number_id: '2' },
            history: [ { errors: declinedErrors } ],
          },
        } ],
      } ],
    }
    expect(isWhatsAppWebhookHistoryError(payload)).toBe(true)
    expect(isWhatsAppWebhookHistoryMessage(payload)).toBe(false)
    expect(normalizeWhatsAppWebhookHistoryError(payload)?.metadata.phone_number_id).toBe('2')
  })
})

describe('isWhatsAppWebhookAccountUpdate', () => {
  it('accepts account_update without entry.time', () => {
    expect(isWhatsAppWebhookAccountUpdate({
      object: 'whatsapp_business_account',
      entry: [ {
        id: 'waba-1',
        changes: [ {
          field: 'account_update',
          value: { event: 'PARTNER_ADDED' },
        } ],
      } ],
    })).toBe(true)
  })

  it('accepts business_verification_status shaped updates', () => {
    expect(isWhatsAppWebhookAccountUpdate({
      object: 'whatsapp_business_account',
      entry: [ {
        id: 'waba-1',
        changes: [ {
          field: 'account_update',
          value: { business_verification_status: 'approved' },
        } ],
      } ],
    })).toBe(true)
  })
})
