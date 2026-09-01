import { describe, expect, it } from '@jest/globals'
import {
  isWhatsAppUndeliverableError,
  resolveWhatsAppDeliveryStatus,
  WHATSAPP_UNDELIVERABLE_ERROR_CODE,
  WhatsAppMessageStatus,
} from './whatsapp.js'

describe('whatsapp delivery error helpers', () => {
  const undeliverableError = {
    code: WHATSAPP_UNDELIVERABLE_ERROR_CODE,
    title: 'Message undeliverable',
    message: 'Message undeliverable',
    error_data: { details: 'Message undeliverable' },
  }

  it('detects undeliverable error code 131026', () => {
    expect(isWhatsAppUndeliverableError(undeliverableError)).toBe(true)
    expect(isWhatsAppUndeliverableError({ code: 131049 })).toBe(false)
  })

  it('maps failed + undeliverable to sent', () => {
    expect(resolveWhatsAppDeliveryStatus(WhatsAppMessageStatus.failed, undeliverableError))
      .toBe(WhatsAppMessageStatus.sent)
    expect(resolveWhatsAppDeliveryStatus(WhatsAppMessageStatus.failed, { code: 131049 } as any))
      .toBe(WhatsAppMessageStatus.failed)
    expect(resolveWhatsAppDeliveryStatus(WhatsAppMessageStatus.delivered, undeliverableError))
      .toBe(WhatsAppMessageStatus.delivered)
  })
})
