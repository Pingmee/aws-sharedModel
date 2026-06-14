import { DBObjectInterface, PlatformType } from '../conversation.js'
import { WorkflowNode } from './model.js'
import { AIChatBotGeneratedContent } from '../AI/Chatbot/Model.js'
import { FallbackBaseData, TimerInfo } from './Nodes.js'
import { WorkflowAnalytics } from './workflow-analytics.js'

export type BaseSubFolder = {
  id: string
  name: string
  created: number
  lastModified: number,
  isActive: boolean,
  folderId: string,
  associatedTo: string,

  // GUI
  selected?: boolean
}

export type WorkflowSettings = {
  sharedTimeout: {
    enabled: boolean
    workflowId?: string
    timerInfo?: TimerInfo
  },
  sharedFallback: {
    enabled: boolean
    workflowId?: string
    fallbackData?: FallbackBaseData
  },
}

export type Workflow = BaseSubFolder & {

  //(whatsapp - phoneNumberId, facebook - pageId)
  associatedToBusinessId: string
  associatedToPlatformId?: string // whatsapp - phoneNumberId, facebook - pageId
  platformType?: PlatformType

  triggerType?: string,
  trigger?: WorkflowNode,

  executionCount?: number;      // Number of times the workflow was executed (running number for executions)
  lastExecution?: number;       // Timestamp of the last execution

  /** Canvas analytics (Expert AI). All conversion/button/read stats live here. */
  analytics?: WorkflowAnalytics
  notes?: string;              // Any manual notes or descriptions for the workflow

  settings?: WorkflowSettings

  variables: { [ key: string ]: Variable }
  data: any // For reactflow UI
  parsedData: WorkflowNode[] // for backend execution

  aiChatBotGeneratedContent?: AIChatBotGeneratedContent
}

export type BaseVariable = {
  id: string
  name: string
  parentId: string
  valueType: any
}

export type Expression = BaseVariable & {
  expression: string
}

export type Variable = BaseVariable & {
  variables?: { [ key: string ]: Variable }
}

export type CustomValue = BaseVariable & {
  custom: string
}

export function isCustomValue(obj: any): obj is CustomValue {
  return obj && typeof obj === 'object' && typeof obj.custom === 'string'
}

export function isVariable(obj: any): obj is Variable {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.parentId === 'string' &&
    'valueType' in obj
  )
}

export function isExpression(obj: any): obj is Expression {
  return obj && typeof obj === 'object' && 'expression' in obj && typeof obj.expression === 'string'
}

export type SideBarFolder<T> = {
  id: string,
  name: string,
  associatedTo: string,
  created: number
  lastModified: number,
  items: DBObjectInterface<T[]>

  // GUI
  selected?: boolean
}


export enum AutomationEvents {
  workflowNavigation
}

export interface AutomationsDataExport {
  displayedFlow: () => Promise<Workflow | undefined>
  onAnyChange: () => void
  onEvent: (event: AutomationEvents, data: any) => void
  /** Clears all analytics for a workflow and returns the updated record from the API. */
  resetWorkflowAnalytics?: (workflowId: string) => Promise<Workflow | undefined>
}