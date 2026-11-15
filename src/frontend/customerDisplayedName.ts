import { Customer, PlatformType } from './conversation.js'

/** True when value is empty after trim, or only digits (optional leading +). */
function isNumericCustomerName(value: string | undefined | null): boolean {
  if (!value) return false
  const trimmed = value.trim()
  if (!trimmed) return false
  return /^\+?\d+$/.test(trimmed)
}

function shouldPreferParsedPhoneNumber(
  name: string | undefined | null,
  parsedPhoneNumber: string | undefined | null,
  phoneNumberId: string | undefined | null,
  conversationCustomerPhoneNumberId?: string | null
): boolean {
  if (!parsedPhoneNumber?.trim()) return false
  if (!name?.trim()) return false
  const trimmedName = name.trim()
  if (isNumericCustomerName(trimmedName)) return true
  if (phoneNumberId && trimmedName === phoneNumberId) return true
  if (conversationCustomerPhoneNumberId && trimmedName === conversationCustomerPhoneNumberId) return true
  return false
}

/**
 * Display name from a customer record (or partial snapshot).
 * Used by chatapp conversation cells and server push-notification titles so both stay in sync.
 *
 * Optional `conversationCustomerPhoneNumberId` covers cases where the customer omits `phoneNumberId`.
 * Optional `unknownFallback` defaults to `"Unknown"` (chatapp passes its locale string).
 */
export function customerDisplayedNameForCustomer(
  customer: Partial<Customer> | undefined | null,
  conversationCustomerPhoneNumberId?: string | null,
  unknownFallback = 'Unknown'
): string {
  const { customerName, parsedPhoneNumber, phoneNumberId, customerNickname, metaUserId, platform, email } = customer ?? {}
  const visitorId = phoneNumberId || conversationCustomerPhoneNumberId || undefined

  if (platform === PlatformType.email && email?.trim()) {
    const displayName = customerNickname?.trim() || customerName?.trim()
    if (displayName && displayName.toLowerCase() !== email.trim().toLowerCase()) {
      return displayName
    }
    return email.trim()
  }

  const numberedWebVisitorName = (raw?: string | null): string | undefined => {
    if (platform !== PlatformType.web) {
      return undefined
    }
    const trimmed = raw?.trim()
    const numberedMatch = trimmed?.match(/^(?:Website )?visitor #(\d+)$/i)
    if (numberedMatch) {
      return `Visitor #${ numberedMatch[ 1 ] }`
    }
    const fromId = visitorId && !visitorId.includes('-') && !visitorId.includes(':')
      ? visitorId.match(/[a-z](\d+)$/i)?.[ 1 ]
      : undefined
    if (fromId) {
      return `Visitor #${ fromId }`
    }
    if (trimmed && /^(?:Website )?visitor$/i.test(trimmed)) {
      return 'Visitor'
    }
    return undefined
  }

  if (customerNickname && customerNickname.trim() !== '' && customerName !== customerNickname) {
    const webName = numberedWebVisitorName(customerNickname)
    if (webName) {
      return webName
    }
    if (shouldPreferParsedPhoneNumber(
      customerNickname,
      parsedPhoneNumber,
      phoneNumberId,
      conversationCustomerPhoneNumberId
    )) {
      return parsedPhoneNumber!
    }
    return customerNickname
  }

  if (customerName && customerName.trim() !== '') {
    const webName = numberedWebVisitorName(customerName)
    if (webName) {
      return webName
    }
    if (shouldPreferParsedPhoneNumber(
      customerName,
      parsedPhoneNumber,
      phoneNumberId,
      conversationCustomerPhoneNumberId
    )) {
      return parsedPhoneNumber!
    }
    return customerName
  }

  const webFallback = numberedWebVisitorName(undefined)
  if (webFallback) {
    return webFallback
  }

  return (
    parsedPhoneNumber ??
    conversationCustomerPhoneNumberId ??
    phoneNumberId ??
    metaUserId ??
    unknownFallback
  )
}

/** Phone / email identifier shown under or instead of the display name. */
export function customerDisplayPhoneNumberForCustomer(
  customer: Partial<Customer> | undefined | null,
  conversationCustomerPhoneNumberId?: string | null,
  unknownFallback = 'Unknown'
): string {
  const { parsedPhoneNumber, phoneNumberId, metaUserId, email, platform } = customer ?? {}
  if (platform === PlatformType.email && email?.trim()) {
    return email.trim()
  }
  return parsedPhoneNumber ?? conversationCustomerPhoneNumberId ?? phoneNumberId ?? metaUserId ?? unknownFallback
}
