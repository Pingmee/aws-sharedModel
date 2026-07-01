import { Workflow } from './automations.js'
import { isWorkflowTriggerNodeType } from './Nodes.js'
import { WorkflowNode } from './model.js'

export type WhatsAppTriggerLinkRef = {
  messageQrdlId?: string
  whatsappLink?: string
}

function linkRefFromNodeData(data: Record<string, unknown> | undefined): WhatsAppTriggerLinkRef | undefined {
  if (!data || typeof data !== 'object') {
    return undefined
  }

  const messageQrdlId = typeof data.messageQrdlId === 'string' && data.messageQrdlId.trim()
    ? data.messageQrdlId.trim()
    : undefined
  const whatsappLink = typeof data.whatsappLink === 'string' && data.whatsappLink.trim()
    ? data.whatsappLink.trim()
    : undefined

  if (!messageQrdlId && !whatsappLink) {
    return undefined
  }

  return { messageQrdlId, whatsappLink }
}

function dedupeKey(ref: WhatsAppTriggerLinkRef): string {
  return ref.messageQrdlId ?? ref.whatsappLink ?? ''
}

/** Collects Meta WhatsApp QR link references from Pingmee trigger nodes on a workflow. */
export function collectWhatsAppTriggerLinkRefs(workflow: Workflow): WhatsAppTriggerLinkRef[] {
  const seen = new Set<string>()
  const refs: WhatsAppTriggerLinkRef[] = []

  const addFromData = (data: Record<string, unknown> | undefined) => {
    const ref = linkRefFromNodeData(data)
    if (!ref) {
      return
    }
    const key = dedupeKey(ref)
    if (!key || seen.has(key)) {
      return
    }
    seen.add(key)
    refs.push(ref)
  }

  const addFromNode = (node: WorkflowNode | undefined) => {
    if (!node?.type || !isWorkflowTriggerNodeType(node.type)) {
      return
    }
    addFromData(node.data as Record<string, unknown> | undefined)
  }

  addFromNode(workflow.trigger)

  workflow.parsedData?.forEach((node) => addFromNode(node))

  const canvasNodes = workflow.data?.nodes
  if (Array.isArray(canvasNodes)) {
    canvasNodes.forEach((node) => {
      if (node?.type && isWorkflowTriggerNodeType(node.type)) {
        addFromData(node.data as Record<string, unknown> | undefined)
      }
    })
  }

  return refs
}
