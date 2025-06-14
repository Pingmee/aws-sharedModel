import { DBObjectInterface, PlatformType } from '../conversation'
import { WorkflowNode } from './model'
import { AIChatBotGeneratedContent } from '../AI/Chatbot/Model'

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

export type Workflow = BaseSubFolder & {

  //(whatsapp - phoneNumberId, facebook - pageId)
  associatedToBusinessId: string
  platformType?: PlatformType

  triggerType?: string,
  trigger?: WorkflowNode,

  executionCount?: number;      // Number of times the workflow was executed
  successCount?: number;        // Number of successful executions
  failureCount?: number;        // Number of failed executions
  lastExecution?: number;       // Timestamp of the last execution
  messageReadCount?: number;    // How many people read the message
  buttonClicks?: Record<string, number>; // Tracks button clicks by button ID/name
  conversionRate?: number;     // Percentage of users who completed the workflow's intended outcome
  notes?: string;              // Any manual notes or descriptions for the workflow

  variables: { [key: string]: Variable }
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
  variables?: { [key: string]: Variable  }
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
}