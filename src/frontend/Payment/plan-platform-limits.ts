import { PlanType } from './Model.js'
import { PlatformFacebookMessenger, PlatformWhatsapp } from '../conversation.js'

export type PlanPlatformLimits = {
  /** Max WhatsApp Business accounts. Applies when set. */
  maxWhatsappPlatforms?: number
  /** Max total WhatsApp phone numbers across all connected businesses. Applies when set. */
  maxWhatsappPhoneNumbers?: number
  /** Max Facebook page connections (each may include linked Instagram). */
  maxFacebookConnections: number
  /** Max website chat sites. Applies when set. */
  maxWebsiteConnections?: number
  /**
   * Basic/trial: WhatsApp and website chat share one slot —
   * the business can connect one WhatsApp OR one website, not both.
   */
  exclusiveWhatsappOrWebsite?: boolean
}

export function getPlanPlatformLimits(plan?: PlanType): PlanPlatformLimits {
  switch (plan) {
    case PlanType.basic:
      return {
        maxWhatsappPlatforms: 1,
        maxFacebookConnections: 1,
        maxWebsiteConnections: 1,
        exclusiveWhatsappOrWebsite: true,
      }
    case PlanType.expended:
      return {
        maxWhatsappPlatforms: 3,
        maxFacebookConnections: 2,
        maxWebsiteConnections: 1,
      }
    case PlanType.expertAI:
      return {
        maxWhatsappPhoneNumbers: 5,
        maxFacebookConnections: 5,
        maxWebsiteConnections: 3,
      }
    case PlanType.partner:
      return {
        maxWhatsappPhoneNumbers: 5,
        maxFacebookConnections: 5,
        maxWebsiteConnections: 10,
      }
    case PlanType.trial:
      return {
        maxWhatsappPlatforms: 1,
        maxFacebookConnections: 1,
        maxWebsiteConnections: 1,
        exclusiveWhatsappOrWebsite: true,
      }
    default:
      return {
        maxWhatsappPlatforms: 1,
        maxFacebookConnections: 1,
        maxWebsiteConnections: 1,
        exclusiveWhatsappOrWebsite: true,
      }
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
    maxWebsiteConnections: overrides.maxWebsiteConnections ?? planLimits.maxWebsiteConnections,
    exclusiveWhatsappOrWebsite: overrides.exclusiveWhatsappOrWebsite ?? planLimits.exclusiveWhatsappOrWebsite,
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
  websiteSitesCount = 0,
): boolean {
  const isNewPlatform = !existingConnections.some(
    connection => connection.wa_business_id === incomingBusinessId,
  )

  if (limits.exclusiveWhatsappOrWebsite && websiteSitesCount > 0 && isNewPlatform) {
    return true
  }

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

export function wouldExceedWebsitePlatformLimits(
  limits: PlanPlatformLimits,
  existingWebsiteCount: number,
  addingNewSite: boolean,
  hasWhatsappConnection = false,
): boolean {
  if (!addingNewSite) {
    return false
  }

  if (limits.exclusiveWhatsappOrWebsite && hasWhatsappConnection) {
    return true
  }

  if (limits.maxWebsiteConnections != null) {
    return existingWebsiteCount + 1 > limits.maxWebsiteConnections
  }

  return false
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

  if (limits.exclusiveWhatsappOrWebsite) {
    return 'Your plan allows either one WhatsApp connection or one website chat — not both. Upgrade your plan to add more.'
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

export function getWebsitePlatformLimitErrorMessage(
  plan?: PlanType,
  overrides?: Partial<PlanPlatformLimits>,
): string {
  const limits = getBusinessPlatformLimits(plan, overrides)

  if (limits.exclusiveWhatsappOrWebsite) {
    return 'Your plan allows either one WhatsApp connection or one website chat — not both. Upgrade your plan to add more.'
  }

  if (limits.maxWebsiteConnections != null) {
    return `Your plan allows up to ${ limits.maxWebsiteConnections } website chat connection${ limits.maxWebsiteConnections === 1 ? '' : 's' }. Upgrade your plan to add more.`
  }

  return 'Your plan does not allow adding more website chat connections. Upgrade your plan to add more.'
}
