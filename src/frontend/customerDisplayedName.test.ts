import { describe, expect, it } from '@jest/globals'
import { customerDisplayedNameForCustomer } from './customerDisplayedName.js'
import { PlatformType } from './conversation.js'

describe('customerDisplayedNameForCustomer', () => {
  it('uses parsedPhoneNumber when customerName is all digits', () => {
    expect(
      customerDisplayedNameForCustomer({
        customerName: '972501234567',
        phoneNumberId: '972501234567',
        parsedPhoneNumber: '+972 50-123-4567',
      })
    ).toBe('+972 50-123-4567')
  })

  it('uses parsedPhoneNumber when customerName equals phoneNumberId', () => {
    expect(
      customerDisplayedNameForCustomer({
        customerName: 'meta-user-abc',
        phoneNumberId: 'meta-user-abc',
        parsedPhoneNumber: '+972 50-123-4567',
      })
    ).toBe('+972 50-123-4567')
  })

  it('uses parsedPhoneNumber when customerName equals conversation customerPhoneNumberId', () => {
    expect(
      customerDisplayedNameForCustomer(
        {
          customerName: '972509998877',
          phoneNumberId: 'other-id',
          parsedPhoneNumber: '+972 50-999-8877',
        },
        '972509998877'
      )
    ).toBe('+972 50-999-8877')
  })

  it('keeps a real text customerName when parsedPhoneNumber exists', () => {
    expect(
      customerDisplayedNameForCustomer({
        customerName: 'Alex',
        phoneNumberId: '972501234567',
        parsedPhoneNumber: '+972 50-123-4567',
      })
    ).toBe('Alex')
  })

  it('falls back to customerName when there is no parsedPhoneNumber', () => {
    expect(
      customerDisplayedNameForCustomer({
        customerName: '972501234567',
        phoneNumberId: '972501234567',
      })
    ).toBe('972501234567')
  })

  it('prefers nickname over customerName', () => {
    expect(
      customerDisplayedNameForCustomer({
        customerName: 'WhatsApp Name',
        customerNickname: 'Shop nickname',
        phoneNumberId: '972501234567',
      })
    ).toBe('Shop nickname')
  })

  it('numbers untitled website visitors from short visitor ids', () => {
    expect(
      customerDisplayedNameForCustomer({
        customerName: 'Visitor',
        phoneNumberId: '7qnocv3',
        platform: PlatformType.web,
      })
    ).toBe('Visitor #3')
  })

  it('keeps an already numbered website visitor name', () => {
    expect(
      customerDisplayedNameForCustomer({
        customerName: 'Visitor #9',
        phoneNumberId: '7qnocv9',
        platform: PlatformType.web,
      })
    ).toBe('Visitor #9')
  })

  it('shortens legacy Website visitor labels', () => {
    expect(
      customerDisplayedNameForCustomer({
        customerName: 'Website visitor #9',
        phoneNumberId: '7qnocv9',
        platform: PlatformType.web,
      })
    ).toBe('Visitor #9')
  })

  it('does not number pending ids that contain hyphens or colons', () => {
    expect(
      customerDisplayedNameForCustomer({
        customerName: 'Visitor',
        phoneNumberId: '7306d603-b46c-4c0b-b0ca-6e0d329949fa',
        platform: PlatformType.web,
      })
    ).toBe('Visitor')
  })

  it('for email prefers nickname/name when different from address', () => {
    expect(
      customerDisplayedNameForCustomer({
        customerName: 'Ada',
        email: 'ada@example.com',
        platform: PlatformType.email,
      })
    ).toBe('Ada')
  })

  it('for email falls back to address when name matches email', () => {
    expect(
      customerDisplayedNameForCustomer({
        customerName: 'ada@example.com',
        email: 'ada@example.com',
        platform: PlatformType.email,
      })
    ).toBe('ada@example.com')
  })

  it('uses unknownFallback when nothing else is available', () => {
    expect(customerDisplayedNameForCustomer({}, null, 'לא ידוע')).toBe('לא ידוע')
  })
})
