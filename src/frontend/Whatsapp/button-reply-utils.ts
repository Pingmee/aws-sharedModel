/** Prefix for auto-generated carousel quick-reply payloads sent to Meta. */
export const CAROUSEL_BUTTON_PAYLOAD_PREFIX = 'pm_carousel'

export function buildCarouselQuickReplyPayload(cardIndex: number, buttonIndex: number): string {
  return `${CAROUSEL_BUTTON_PAYLOAD_PREFIX}:${cardIndex}:${buttonIndex}`
}

export function parseCarouselQuickReplyPayload(
  payload: string,
): { cardIndex: number; buttonIndex: number } | undefined {
  const match = payload.trim().match(/^pm_carousel:(\d+):(\d+)$/)
  if (!match) {
    return undefined
  }

  return {
    cardIndex: Number.parseInt(match[1], 10),
    buttonIndex: Number.parseInt(match[2], 10),
  }
}

type ButtonAnswerMatchInput = {
  message?: string
  buttonPayload?: string
}

type ButtonAnswerSubNode = {
  title?: string
  data?: {
    buttonPayload?: string
  }
}

/**
 * Matches an inbound button reply to a workflow answer subnode.
 * Text/title match is checked first for backward compatibility with existing flows.
 */
export function messageMatchesWorkflowButtonAnswer(
  inputMessage: ButtonAnswerMatchInput,
  answerSubNode: ButtonAnswerSubNode,
): boolean {
  const title = answerSubNode.title?.trim()
  const text = inputMessage.message?.trim()
  const payload = inputMessage.buttonPayload?.trim()
  const subNodePayload = answerSubNode.data?.buttonPayload?.trim()

  if (title && text && title === text) {
    return true
  }

  if (payload) {
    if (subNodePayload && subNodePayload === payload) {
      return true
    }
    if (title && title === payload) {
      return true
    }
  }

  return false
}
