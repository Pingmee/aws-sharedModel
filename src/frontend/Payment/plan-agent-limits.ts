import { PlanType } from './Model.js'
import { UserStatus } from '../conversation.js'

export type PlanAgentLimits = {
  /** Max workspace users including the owner. */
  maxAgents?: number
}

export function getPlanAgentLimits(plan?: PlanType): PlanAgentLimits {
  switch (plan) {
    case PlanType.basic:
    case PlanType.trial:
      return { maxAgents: 1 }
    case PlanType.expended:
      return { maxAgents: 5 }
    case PlanType.expertAI:
    case PlanType.partner:
      return { maxAgents: 10 }
    default:
      return { maxAgents: 1 }
  }
}

/** Plan-included seats only (excludes purchased add-ons). */
export function getPlanAgentLimit(plan?: PlanType): number | undefined {
  return getPlanAgentLimits(plan).maxAgents
}

/** Plan max plus optional purchased add-on seats from BusinessSettings.additionalAgentsPurchased. */
export function getBusinessAgentLimit(
  plan?: PlanType,
  additionalAgentsPurchased?: number,
): number | undefined {
  const { maxAgents } = getPlanAgentLimits(plan)
  if (maxAgents == null) {
    return undefined
  }

  const purchased = Math.max(0, additionalAgentsPurchased ?? 0)
  return maxAgents + purchased
}

export function wouldExceedAgentLimit(
  plan: PlanType | undefined,
  currentAgentCount: number,
  additionalAgentsPurchased?: number,
): boolean {
  const limit = getBusinessAgentLimit(plan, additionalAgentsPurchased)
  if (limit == null) {
    return false
  }

  return currentAgentCount >= limit
}

export function canInviteAgent(
  plan: PlanType | undefined,
  currentAgentCount: number,
  additionalAgentsPurchased?: number,
): boolean {
  return !wouldExceedAgentLimit(plan, currentAgentCount, additionalAgentsPurchased)
}

export function getAgentLimitErrorMessage(
  plan?: PlanType,
  additionalAgentsPurchased?: number,
): string {
  const limit = getBusinessAgentLimit(plan, additionalAgentsPurchased)

  if (limit == null) {
    return 'Your plan does not allow inviting more agents. Upgrade your plan to add more.'
  }

  return `Your plan allows up to ${ limit } user${ limit === 1 ? '' : 's' } including the owner. Upgrade your plan or purchase additional seats to invite more.`
}

/** Inactive agents do not consume a seat. Invited and active users do. */
export function userCountsTowardAgentSeat(status?: UserStatus): boolean {
  return status !== UserStatus.inActive
}

export function countAgentSeats<T extends { status?: UserStatus }>(users: T[]): number {
  return users.filter((user) => userCountsTowardAgentSeat(user.status)).length
}
