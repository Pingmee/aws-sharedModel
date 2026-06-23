import { WorkflowNode } from './model.js'
import { PlanType } from '../Payment/Model.js'

export { isWorkflowTriggerNodeType } from './Nodes.js'

export type WorkflowNodeStats = {
  enteredCount: number
  completedCount: number
  exitedCount: number
}

export type WorkflowEdgeStats = {
  sourceNodeId: string
  targetNodeId: string
  sourceHandle?: string
  traversalCount: number
}

export type WorkflowButtonStats = {
  subNodeId: string
  parentNodeId: string
  label: string
  clickCount: number
  payload?: string
}

export type WorkflowAnalytics = {
  totalStarted: number
  totalCompleted: number
  totalDropped: number
  nodeStats: Record<string, WorkflowNodeStats>
  edgeStats: Record<string, WorkflowEdgeStats>
  buttonStats: Record<string, WorkflowButtonStats>
  lastUpdated?: number
}

export type WorkflowAnalyticsEvent =
  | { type: 'execution_started'; triggerNodeId?: string }
  | { type: 'node_entered'; nodeId: string }
  | { type: 'node_completed'; nodeId: string }
  | { type: 'edge_traversed'; sourceNodeId: string; targetNodeId: string; sourceHandle?: string }
  | { type: 'button_clicked'; subNodeId: string; parentNodeId: string; label: string; payload?: string }
  | { type: 'execution_completed'; success: boolean }

export function createEmptyWorkflowAnalytics(): WorkflowAnalytics {
  return {
    totalStarted: 0,
    totalCompleted: 0,
    totalDropped: 0,
    nodeStats: {},
    edgeStats: {},
    buttonStats: {},
  }
}

export function buildEdgeStatsKey(sourceNodeId: string, targetNodeId: string, sourceHandle?: string): string {
  return sourceHandle
    ? `${ sourceNodeId }->${ targetNodeId }:${ sourceHandle }`
    : `${ sourceNodeId }->${ targetNodeId }`
}

function ensureNodeStats(analytics: WorkflowAnalytics, nodeId: string): WorkflowNodeStats {
  if (!analytics.nodeStats[ nodeId ]) {
    analytics.nodeStats[ nodeId ] = { enteredCount: 0, completedCount: 0, exitedCount: 0 }
  }
  return analytics.nodeStats[ nodeId ]
}

function ensureEdgeStats(
  analytics: WorkflowAnalytics,
  sourceNodeId: string,
  targetNodeId: string,
  sourceHandle?: string,
): WorkflowEdgeStats {
  const key = buildEdgeStatsKey(sourceNodeId, targetNodeId, sourceHandle)
  if (!analytics.edgeStats[ key ]) {
    analytics.edgeStats[ key ] = { sourceNodeId, targetNodeId, sourceHandle, traversalCount: 0 }
  }
  return analytics.edgeStats[ key ]
}

export function applyWorkflowAnalyticsEvent(
  current: WorkflowAnalytics | undefined,
  event: WorkflowAnalyticsEvent,
): WorkflowAnalytics {
  const analytics: WorkflowAnalytics = {
    ...(current ?? createEmptyWorkflowAnalytics()),
    nodeStats: { ...(current?.nodeStats ?? {}) },
    edgeStats: { ...(current?.edgeStats ?? {}) },
    buttonStats: { ...(current?.buttonStats ?? {}) },
  }

  switch (event.type) {
    case 'execution_started': {
      analytics.totalStarted += 1
      break
    }
    case 'node_entered': {
      ensureNodeStats(analytics, event.nodeId).enteredCount += 1
      break
    }
    case 'node_completed': {
      ensureNodeStats(analytics, event.nodeId).completedCount += 1
      break
    }
    case 'edge_traversed': {
      ensureEdgeStats(analytics, event.sourceNodeId, event.targetNodeId, event.sourceHandle).traversalCount += 1
      ensureNodeStats(analytics, event.sourceNodeId).exitedCount += 1
      break
    }
    case 'button_clicked': {
      ensureNodeStats(analytics, event.subNodeId).enteredCount += 1
      ensureNodeStats(analytics, event.parentNodeId).exitedCount += 1
      const existing = analytics.buttonStats[ event.subNodeId ]
      analytics.buttonStats[ event.subNodeId ] = {
        subNodeId: event.subNodeId,
        parentNodeId: event.parentNodeId,
        label: event.label,
        payload: event.payload,
        clickCount: (existing?.clickCount ?? 0) + 1,
      }
      break
    }
    case 'execution_completed': {
      if (event.success) {
        analytics.totalCompleted += 1
      } else {
        analytics.totalDropped += 1
      }
      break
    }
  }

  analytics.lastUpdated = Date.now()
  return analytics
}

export function computeWorkflowConversionRate(analytics?: WorkflowAnalytics): number {
  if (!analytics?.totalStarted) return 0
  return Math.round((analytics.totalCompleted / analytics.totalStarted) * 1000) / 10
}

/** Conversion rate from workflow analytics. */
export function resolveWorkflowConversionRate(workflow?: { analytics?: WorkflowAnalytics }): number {
  return computeWorkflowConversionRate(workflow?.analytics)
}

export function aggregateWorkflowButtonClicks(analytics?: WorkflowAnalytics): Record<string, number> {
  if (!analytics?.buttonStats) return {}
  return Object.fromEntries(
    Object.entries(analytics.buttonStats).map(([ id, stat ]) => [ id, stat.clickCount ]),
  )
}

export function resolveWorkflowButtonStats(
  workflow?: { analytics?: WorkflowAnalytics },
  parentNodeId?: string,
): WorkflowButtonStats[] {
  const fromAnalytics = Object.values(workflow?.analytics?.buttonStats ?? {})
  return parentNodeId ? fromAnalytics.filter((s) => s.parentNodeId === parentNodeId) : fromAnalytics
}

export function getNodeParticipationPercent(nodeId: string, analytics?: WorkflowAnalytics): number {
  const entered = analytics?.nodeStats?.[ nodeId ]?.enteredCount ?? 0
  const total = analytics?.totalStarted ?? 0
  if (!total || !entered) return 0
  return Math.round((entered / total) * 1000) / 10
}

export function getEdgeTraversalPercent(
  sourceNodeId: string,
  targetNodeId: string,
  analytics?: WorkflowAnalytics,
  sourceHandle?: string,
): number {
  const key = buildEdgeStatsKey(sourceNodeId, targetNodeId, sourceHandle)
  const traversed = analytics?.edgeStats?.[ key ]?.traversalCount ?? 0
  const buttonParentId = analytics?.buttonStats?.[ sourceNodeId ]?.parentNodeId
  const sourceEntered = buttonParentId
    ? (analytics?.nodeStats?.[ buttonParentId ]?.enteredCount ?? 0)
    : (analytics?.nodeStats?.[ sourceNodeId ]?.enteredCount ?? 0)
  if (!sourceEntered || !traversed) return 0
  return Math.round((traversed / sourceEntered) * 1000) / 10
}

export function getTopWorkflowButtons(
  analytics: WorkflowAnalytics | undefined,
  parentNodeId?: string,
  limit = 3,
): WorkflowButtonStats[] {
  const stats = Object.values(analytics?.buttonStats ?? {})
  const filtered = parentNodeId ? stats.filter((s) => s.parentNodeId === parentNodeId) : stats
  return [ ...filtered ].sort((a, b) => b.clickCount - a.clickCount).slice(0, limit)
}

export function getTopWorkflowButtonsFromWorkflow(
  workflow?: { analytics?: WorkflowAnalytics },
  parentNodeId?: string,
  limit = 3,
): WorkflowButtonStats[] {
  return [ ...resolveWorkflowButtonStats(workflow, parentNodeId) ]
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, limit)
}

export function isWorkflowNodeParticipating(nodeId: string, analytics?: WorkflowAnalytics): boolean {
  return (analytics?.nodeStats?.[ nodeId ]?.enteredCount ?? 0) > 0
}

export function getButtonClickPercent(subNodeId: string, analytics?: WorkflowAnalytics): number {
  const stat = analytics?.buttonStats?.[ subNodeId ]
  if (!stat) return 0
  const parentEntered = analytics?.nodeStats?.[ stat.parentNodeId ]?.enteredCount ?? 0
  if (!parentEntered) return 0
  return Math.round((stat.clickCount / parentEntered) * 1000) / 10
}

export type WorkflowGraphSnapshotSource = {
  parsedData?: WorkflowNode[]
  trigger?: WorkflowNode
  data?: {
    nodes?: Array<{ id: string }>
    edges?: Array<{ source: string; target: string; sourceHandle?: string | null }>
  }
}

function collectNodeIdsFromWorkflowNode(node: WorkflowNode, ids: Set<string>): void {
  ids.add(node.id)
  node.subNodes?.forEach((subNode) => collectNodeIdsFromWorkflowNode(subNode, ids))
}

/** All node and sub-node ids present on the workflow canvas / execution graph. */
export function collectWorkflowNodeIds(workflow: WorkflowGraphSnapshotSource): Set<string> {
  const ids = new Set<string>()
  workflow.parsedData?.forEach((node) => collectNodeIdsFromWorkflowNode(node, ids))
  if (workflow.trigger) {
    collectNodeIdsFromWorkflowNode(workflow.trigger, ids)
  }
  workflow.data?.nodes?.forEach((node) => ids.add(node.id))
  return ids
}

function addEdgeStatsKeyVariants(
  keys: Set<string>,
  source: string,
  target: string,
  sourceHandle?: string | null,
): void {
  keys.add(buildEdgeStatsKey(source, target, sourceHandle ?? undefined))
  keys.add(buildEdgeStatsKey(source, target, source))
  keys.add(buildEdgeStatsKey(source, target, undefined))
  if (sourceHandle && sourceHandle !== 'in') {
    keys.add(buildEdgeStatsKey(source, target, 'in'))
  }
}

function walkWorkflowConnections(node: WorkflowNode, keys: Set<string>): void {
  node.connections?.out?.forEach((targetId) => {
    addEdgeStatsKeyVariants(keys, node.id, targetId)
  })
  node.subNodes?.forEach((subNode) => {
    subNode.connections?.out?.forEach((targetId) => {
      addEdgeStatsKeyVariants(keys, subNode.id, targetId, subNode.id)
      addEdgeStatsKeyVariants(keys, subNode.id, targetId, 'in')
    })
    walkWorkflowConnections(subNode, keys)
  })
}

/** Edge stat keys that still exist on the current graph (includes runtime handle variants). */
export function collectValidEdgeStatsKeys(workflow: WorkflowGraphSnapshotSource): Set<string> {
  const keys = new Set<string>()

  workflow.data?.edges?.forEach((edge) => {
    addEdgeStatsKeyVariants(keys, edge.source, edge.target, edge.sourceHandle)
  })

  workflow.parsedData?.forEach((node) => walkWorkflowConnections(node, keys))
  if (workflow.trigger) {
    walkWorkflowConnections(workflow.trigger, keys)
  }

  return keys
}

export function pruneWorkflowAnalytics(
  analytics: WorkflowAnalytics,
  nodeIds: Set<string>,
  validEdgeKeys: Set<string>,
): WorkflowAnalytics {
  const nodeStats: Record<string, WorkflowNodeStats> = {}
  for (const [ nodeId, stat ] of Object.entries(analytics.nodeStats)) {
    if (nodeIds.has(nodeId)) {
      nodeStats[ nodeId ] = stat
    }
  }

  const buttonStats: Record<string, WorkflowButtonStats> = {}
  for (const [ subNodeId, stat ] of Object.entries(analytics.buttonStats)) {
    if (nodeIds.has(subNodeId) && nodeIds.has(stat.parentNodeId)) {
      buttonStats[ subNodeId ] = stat
    }
  }

  const edgeStats: Record<string, WorkflowEdgeStats> = {}
  for (const [ key, stat ] of Object.entries(analytics.edgeStats)) {
    if (validEdgeKeys.has(key)) {
      edgeStats[ key ] = stat
      continue
    }
    const canonical = buildEdgeStatsKey(stat.sourceNodeId, stat.targetNodeId, stat.sourceHandle)
    if (validEdgeKeys.has(canonical) && nodeIds.has(stat.sourceNodeId) && nodeIds.has(stat.targetNodeId)) {
      edgeStats[ key ] = stat
    }
  }

  return {
    ...analytics,
    nodeStats,
    buttonStats,
    edgeStats,
    lastUpdated: Date.now(),
  }
}

export function pruneWorkflowAnalyticsForWorkflow(
  analytics: WorkflowAnalytics,
  workflow: WorkflowGraphSnapshotSource,
): WorkflowAnalytics {
  return pruneWorkflowAnalytics(
    analytics,
    collectWorkflowNodeIds(workflow),
    collectValidEdgeStatsKeys(workflow),
  )
}

/** Clears all workflow analytics counters and per-step stats. */
export function buildFullWorkflowAnalyticsResetUpdate() {
  return {
    analytics: createEmptyWorkflowAnalytics(),
  }
}

export function formatAnalyticsPercent(value: number): string {
  if (value <= 0) return '0%'
  if (value >= 100) return '100%'
  return `${ value }%`
}

/** Conversations that started but have not completed or dropped yet. */
export function getWorkflowInProgressCount(analytics?: WorkflowAnalytics): number {
  if (!analytics) return 0
  const started = analytics.totalStarted ?? 0
  const completed = analytics.totalCompleted ?? 0
  const dropped = analytics.totalDropped ?? 0
  return Math.max(0, started - completed - dropped)
}

/** Workflow canvas analytics (overlays, summary panel, reset) is an Expert AI plan feature. */
export function canAccessWorkflowAnalytics(plan?: PlanType): boolean {
  return plan === PlanType.expertAI
}

export function hideWorkflowAnalyticsForPlan<
  T extends {
    analytics?: WorkflowAnalytics
  },
>(workflow: T, plan?: PlanType): T {
  if (canAccessWorkflowAnalytics(plan)) {
    return workflow
  }

  return {
    ...workflow,
    analytics: undefined,
  }
}
