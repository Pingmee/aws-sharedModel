import { Plans, PlanType } from './Model.js'

export type CheckoutPlanId = PlanType.basic | PlanType.expended | PlanType.expertAI

export type PlanAddonConfig = {
  plan: CheckoutPlanId
  includedAgents: number
  canBuyExtraAgents: boolean
  maxAgents: number
  includedStorageGb: number
  maxStorageGb: number
}

/** Extra costs (ILS / month, excl. VAT) */
export const CHECKOUT_ADDON_PRICES = {
  extraAgentPerMonth: 30,
  extraStorageGbPerMonth: 5,
} as const

export const CHECKOUT_VAT_MULTIPLIER = 1.18

export const PLAN_CHECKOUT_ADDONS: Record<CheckoutPlanId, PlanAddonConfig> = {
  [ PlanType.basic ]: {
    plan: PlanType.basic,
    includedAgents: 1,
    canBuyExtraAgents: false,
    maxAgents: 1,
    includedStorageGb: 15,
    maxStorageGb: 16,
  },
  [ PlanType.expended ]: {
    plan: PlanType.expended,
    includedAgents: 5,
    canBuyExtraAgents: true,
    maxAgents: 25,
    includedStorageGb: 15,
    maxStorageGb: 16,
  },
  [ PlanType.expertAI ]: {
    plan: PlanType.expertAI,
    includedAgents: 10,
    canBuyExtraAgents: true,
    maxAgents: 50,
    includedStorageGb: 15,
    maxStorageGb: 16,
  },
}

export type CheckoutAddonSelections = {
  agents: number
  storageGb: number
}

export type CheckoutQuoteInput = {
  plan: string
  isPaymentYearly: boolean
  agents?: number
  storageGb?: number
}

export type CheckoutQuote = {
  plan: CheckoutPlanId
  planName: string
  isPaymentYearly: boolean
  agents: number
  storageGb: number
  extraAgents: number
  extraStorageGb: number
  priceExVat: number
  priceIncVat: number
  description: string
}

export type CheckoutQuoteError = {
  error: string
}

const CHECKOUT_PLANS = new Set<string>([
  PlanType.basic,
  PlanType.expended,
  PlanType.expertAI,
])

export function isCheckoutPlan(plan: string): plan is CheckoutPlanId {
  return CHECKOUT_PLANS.has(plan)
}

export function defaultCheckoutAddons(plan: CheckoutPlanId): CheckoutAddonSelections {
  const cfg = PLAN_CHECKOUT_ADDONS[ plan ]
  return {
    agents: cfg.includedAgents,
    storageGb: cfg.includedStorageGb,
  }
}

/**
 * Server-safe subscription quote. Never trusts a client-supplied amount.
 * Returns `{ error }` when plan/addons are invalid.
 */
export function computeCheckoutQuote(
  input: CheckoutQuoteInput,
): CheckoutQuote | CheckoutQuoteError {
  if (!isCheckoutPlan(input.plan)) {
    return { error: 'Invalid plan' }
  }

  const plan = Plans[ input.plan ]
  if (!plan?.isActive) {
    return { error: 'Plan is not available' }
  }

  const cfg = PLAN_CHECKOUT_ADDONS[ input.plan ]
  const defaults = defaultCheckoutAddons(input.plan)
  const requestedAgents = input.agents ?? defaults.agents
  const requestedStorageGb = input.storageGb ?? defaults.storageGb

  if (!Number.isFinite(requestedAgents) || !Number.isFinite(requestedStorageGb)) {
    return { error: 'Invalid addon selections' }
  }

  if (
    requestedAgents < cfg.includedAgents ||
    requestedAgents > cfg.maxAgents ||
    !Number.isInteger(requestedAgents)
  ) {
    return { error: 'agents out of range for plan' }
  }

  if (
    requestedStorageGb < cfg.includedStorageGb ||
    requestedStorageGb > cfg.maxStorageGb ||
    !Number.isInteger(requestedStorageGb)
  ) {
    return { error: 'storageGb out of range for plan' }
  }

  const extraAgents = cfg.canBuyExtraAgents
    ? Math.max(0, requestedAgents - cfg.includedAgents)
    : 0
  const extraStorageGb = Math.max(0, requestedStorageGb - cfg.includedStorageGb)

  if (!cfg.canBuyExtraAgents && requestedAgents !== cfg.includedAgents) {
    return { error: 'agents out of range for plan' }
  }

  const addonsMonthly =
    extraAgents * CHECKOUT_ADDON_PRICES.extraAgentPerMonth +
    extraStorageGb * CHECKOUT_ADDON_PRICES.extraStorageGbPerMonth

  const priceExVat = input.isPaymentYearly
    ? plan.yearlyPrice + addonsMonthly * 12
    : plan.monthlyPrice + addonsMonthly

  const priceIncVat = Math.round(priceExVat * CHECKOUT_VAT_MULTIPLIER * 100) / 100

  const billingLabel = input.isPaymentYearly ? 'שנתי' : 'חודשי'
  const changeParts: string[] = [ billingLabel ]
  if (extraAgents > 0) {
    changeParts.push(`+${ extraAgents } סוכנים`)
  }
  if (extraStorageGb > 0) {
    changeParts.push(`+${ extraStorageGb }GB אחסון`)
  }

  const description = `תוכנית ${ plan.name } | ${ changeParts.join(' | ') }`

  return {
    plan: input.plan,
    planName: plan.name,
    isPaymentYearly: input.isPaymentYearly,
    agents: requestedAgents,
    storageGb: requestedStorageGb,
    extraAgents,
    extraStorageGb,
    priceExVat,
    priceIncVat,
    description,
  }
}

export function isCheckoutQuoteError(
  value: CheckoutQuote | CheckoutQuoteError,
): value is CheckoutQuoteError {
  return 'error' in value
}
