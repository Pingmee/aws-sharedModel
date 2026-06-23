import { Workflow } from './automations.js'
import { isWorkflowTriggerNodeType } from './Nodes.js'
import { WorkflowNode } from './model.js'

function stripWhatsAppTriggerLinkFromNodeData(
  data: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!data || typeof data !== 'object') {
    return data
  }

  if (data.whatsappLink === undefined && data.messageQrdlId === undefined) {
    return data
  }

  const { whatsappLink: _whatsappLink, messageQrdlId: _messageQrdlId, ...rest } = data
  return rest
}

function stripWhatsAppTriggerLinkFromWorkflowNode(node: WorkflowNode | undefined): WorkflowNode | undefined {
  if (!node) {
    return node
  }

  const cleanedData = stripWhatsAppTriggerLinkFromNodeData(node.data as Record<string, unknown> | undefined)
  if (cleanedData === node.data) {
    return node
  }

  return {
    ...node,
    data: cleanedData as WorkflowNode['data'],
  }
}

/** Removes Meta WhatsApp QR link references so a duplicated workflow does not share the original link. */
export function stripWhatsAppTriggerLinkReferences(workflow: Workflow): Workflow {
  let changed = false
  const nextWorkflow: Workflow = { ...workflow }

  const cleanedTrigger = stripWhatsAppTriggerLinkFromWorkflowNode(workflow.trigger)
  if (cleanedTrigger !== workflow.trigger) {
    nextWorkflow.trigger = cleanedTrigger
    changed = true
  }

  if (workflow.parsedData?.length) {
    const cleanedParsedData = workflow.parsedData.map((node: WorkflowNode) => {
      if (!isWorkflowTriggerNodeType(node.type)) {
        return node
      }
      const cleanedNode = stripWhatsAppTriggerLinkFromWorkflowNode(node)
      if (cleanedNode !== node) {
        changed = true
      }
      return cleanedNode ?? node
    })
    nextWorkflow.parsedData = cleanedParsedData
  }

  const canvasNodes = workflow.data?.nodes
  if (Array.isArray(canvasNodes)) {
    const cleanedCanvasNodes = canvasNodes.map((node: { id?: string; type?: string; data?: Record<string, unknown> }) => {
      if (!node?.type || !isWorkflowTriggerNodeType(node.type)) {
        return node
      }

      const cleanedData = stripWhatsAppTriggerLinkFromNodeData(node.data)
      if (cleanedData === node.data) {
        return node
      }

      changed = true
      return {
        ...node,
        data: cleanedData,
      }
    })
    nextWorkflow.data = {
      ...workflow.data,
      nodes: cleanedCanvasNodes,
    }
  }

  return changed ? nextWorkflow : workflow
}
