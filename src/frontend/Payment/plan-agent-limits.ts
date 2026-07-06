import { PlanType } from './Model.js'

export type PlanAgentLimits = {
  /** Max users (owner + agents) for the workspace. Omit for unlimited. */
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
      return { maxAgents: 10 }
    case PlanType.partner:
      return {}
    default:
      return { maxAgents: 1 }
  }
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
  if (plan === PlanType.partner) {
    return false
  }

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

  return `Your plan allows up to ${ limit } agent seat${ limit === 1 ? '' : 's' }. Upgrade your plan or purchase additional seats to invite more.`
}
