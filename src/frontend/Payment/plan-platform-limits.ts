import { PlanType } from './Model.js'
import { PlatformFacebookMessenger, PlatformWhatsapp } from '../conversation.js'

export type PlanPlatformLimits = {
  /** Max WhatsApp Business accounts. Applies when set. */
  maxWhatsappPlatforms?: number
  /** Max total WhatsApp phone numbers across all connected businesses. Applies when set. */
  maxWhatsappPhoneNumbers?: number
  /** Max Facebook page connections (each may include linked Instagram). */
  maxFacebookConnections: number
}

export function getPlanPlatformLimits(plan?: PlanType): PlanPlatformLimits {
  switch (plan) {
    case PlanType.basic:
      return { maxWhatsappPlatforms: 1, maxFacebookConnections: 1 }
    case PlanType.expended:
      return { maxWhatsappPlatforms: 3, maxFacebookConnections: 2 }
    case PlanType.expertAI:
      return { maxWhatsappPhoneNumbers: 5, maxFacebookConnections: 5 }
    case PlanType.partner:
      return { maxWhatsappPhoneNumbers: 5, maxFacebookConnections: 5 }
    case PlanType.trial:
      return { maxWhatsappPlatforms: 1, maxFacebookConnections: 1 }
    default:
      return { maxWhatsappPlatforms: 1, maxFacebookConnections: 1 }
  }
}

/** Plan defaults merged with optional per-business overrides from BusinessSettings.platformLimits. */
export function getBusinessPlatformLimits(
  plan?: PlanType,
  overrides?: Partial<PlanPlatformLimits>,
): PlanPlatformLimits {
  const planLimits = getPlanPlatformLimits(plan)
  if (!overrides) {
    return planLimits
  }

  return {
    maxWhatsappPlatforms: overrides.maxWhatsappPlatforms ?? planLimits.maxWhatsappPlatforms,
    maxWhatsappPhoneNumbers: overrides.maxWhatsappPhoneNumbers ?? planLimits.maxWhatsappPhoneNumbers,
    maxFacebookConnections: overrides.maxFacebookConnections ?? planLimits.maxFacebookConnections,
  }
}

export function mergeFacebookPagesById(
  existing: PlatformFacebookMessenger[] = [],
  incoming: PlatformFacebookMessenger[] = [],
): PlatformFacebookMessenger[] {
  const map = new Map<string, PlatformFacebookMessenger>()
  existing.forEach(item => map.set(item.id, item))
  incoming.forEach(item =>
    map.set(item.id, { ...(map.get(item.id) ?? {}), ...item }),
  )
  return Array.from(map.values())
}

export function wouldExceedWhatsappPlatformLimits(
  limits: PlanPlatformLimits,
  existingConnections: PlatformWhatsapp[],
  incomingBusinessId: string,
  totalPhoneNumbersAfter: number,
): boolean {
  const isNewPlatform = !existingConnections.some(
    connection => connection.wa_business_id === incomingBusinessId,
  )

  if (limits.maxWhatsappPlatforms != null && isNewPlatform) {
    if (existingConnections.length + 1 > limits.maxWhatsappPlatforms) {
      return true
    }
  }

  if (limits.maxWhatsappPhoneNumbers != null) {
    if (totalPhoneNumbersAfter > limits.maxWhatsappPhoneNumbers) {
      return true
    }
  }

  return false
}

export function wouldExceedFacebookPlatformLimits(
  limits: PlanPlatformLimits,
  existingPages: PlatformFacebookMessenger[],
  incomingPages: PlatformFacebookMessenger[],
): boolean {
  const mergedPages = mergeFacebookPagesById(existingPages, incomingPages)
  return mergedPages.length > limits.maxFacebookConnections
}

export function getWhatsappPlatformLimitErrorMessage(
  plan?: PlanType,
  overrides?: Partial<PlanPlatformLimits>,
): string {
  const limits = getBusinessPlatformLimits(plan, overrides)

  if (limits.maxWhatsappPhoneNumbers != null) {
    return `Your plan allows up to ${ limits.maxWhatsappPhoneNumbers } WhatsApp numbers. Upgrade your plan to add more.`
  }

  if (limits.maxWhatsappPlatforms != null) {
    return `Your plan allows up to ${ limits.maxWhatsappPlatforms } WhatsApp connection${ limits.maxWhatsappPlatforms === 1 ? '' : 's' }. Upgrade your plan to add more.`
  }

  return 'Your plan does not allow adding more WhatsApp connections. Upgrade your plan to add more.'
}

export function getFacebookPlatformLimitErrorMessage(
  plan?: PlanType,
  overrides?: Partial<PlanPlatformLimits>,
): string {
  const limits = getBusinessPlatformLimits(plan, overrides)
  return `Your plan allows up to ${ limits.maxFacebookConnections } Facebook connection${ limits.maxFacebookConnections === 1 ? '' : 's' }. Upgrade your plan to add more.`
}
