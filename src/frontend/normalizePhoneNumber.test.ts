import { describe, expect, it } from '@jest/globals'
import { normalizePhoneNumber } from './normalizePhoneNumber.js'

describe('normalizePhoneNumber', () => {
  it('returns empty for missing input', () => {
    expect(normalizePhoneNumber(undefined)).toEqual({ phoneNumberId: '', countryCode: '' })
    expect(normalizePhoneNumber(null)).toEqual({ phoneNumberId: '', countryCode: '' })
    expect(normalizePhoneNumber('')).toEqual({ phoneNumberId: '', countryCode: '' })
    expect(normalizePhoneNumber('   ')).toEqual({ phoneNumberId: '', countryCode: '' })
    expect(normalizePhoneNumber('abc')).toEqual({ phoneNumberId: '', countryCode: '' })
  })

  it('normalizes Israeli national numbers with the default region', () => {
    expect(normalizePhoneNumber('0501234567')).toEqual({
      phoneNumberId: '972501234567',
      countryCode: '972',
    })
    expect(normalizePhoneNumber('(050) 123-4567')).toEqual({
      phoneNumberId: '972501234567',
      countryCode: '972',
    })
    expect(normalizePhoneNumber('0542276526')).toEqual({
      phoneNumberId: '972542276526',
      countryCode: '972',
    })
    expect(normalizePhoneNumber(542276526)).toEqual({
      phoneNumberId: '972542276526',
      countryCode: '972',
    })
  })

  it('keeps an Israeli number that already includes 972', () => {
    expect(normalizePhoneNumber('972501234567')).toEqual({
      phoneNumberId: '972501234567',
      countryCode: '972',
    })
    expect(normalizePhoneNumber('+972-50-123-4567')).toEqual({
      phoneNumberId: '972501234567',
      countryCode: '972',
    })
    expect(normalizePhoneNumber('00972542276526')).toEqual({
      phoneNumberId: '972542276526',
      countryCode: '972',
    })
  })

  it('keeps a foreign country code instead of prefixing the default region', () => {
    expect(normalizePhoneNumber('+1 415 555 2671')).toEqual({
      phoneNumberId: '14155552671',
      countryCode: '1',
    })
    expect(normalizePhoneNumber('14155552671')).toEqual({
      phoneNumberId: '14155552671',
      countryCode: '1',
    })
    expect(normalizePhoneNumber('00447911123456')).toEqual({
      phoneNumberId: '447911123456',
      countryCode: '44',
    })
  })

  it('uses the caller region for national numbers', () => {
    expect(normalizePhoneNumber('(415) 555-2671', 'US')).toEqual({
      phoneNumberId: '14155552671',
      countryCode: '1',
    })
    expect(normalizePhoneNumber('07911123456', 'GB')).toEqual({
      phoneNumberId: '447911123456',
      countryCode: '44',
    })
  })

  it('assigns the selected country when the number has no calling code', () => {
    expect(normalizePhoneNumber('(256) 603-9171', 'US')).toEqual({
      phoneNumberId: '12566039171',
      countryCode: '1',
    })
    expect(normalizePhoneNumber('(629) 217-2771', 'US')).toEqual({
      phoneNumberId: '16292172771',
      countryCode: '1',
    })
    expect(normalizePhoneNumber('(205)774-3335', 'US')).toEqual({
      phoneNumberId: '12057743335',
      countryCode: '1',
    })
    expect(normalizePhoneNumber('877-431-97521', 'US')).toEqual({
      phoneNumberId: '',
      countryCode: '',
    })
  })

  it('assigns the selected country when the number has no calling code', () => {
    expect(normalizePhoneNumber('(256) 603-9171', 'US')).toEqual({
      phoneNumberId: '12566039171',
      countryCode: '1',
    })
    expect(normalizePhoneNumber('(629) 217-2771', 'US')).toEqual({
      phoneNumberId: '16292172771',
      countryCode: '1',
    })
    expect(normalizePhoneNumber('(205)774-3335', 'US')).toEqual({
      phoneNumberId: '12057743335',
      countryCode: '1',
    })
    expect(normalizePhoneNumber('877-431-97521', 'US')).toEqual({
      phoneNumberId: '',
      countryCode: '',
    })
  })

  it('drops numbers that are not a possible phone', () => {
    expect(normalizePhoneNumber('123')).toEqual({ phoneNumberId: '', countryCode: '' })
    expect(normalizePhoneNumber('05')).toEqual({ phoneNumberId: '', countryCode: '' })
  })
})
