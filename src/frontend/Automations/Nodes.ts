import { Variable } from './automations'
import { TemplateInformation } from '../Whatsapp/template-creation-model'
import { Condition, SubNodeConfigType } from './model'
import { ConversationTag, UserPublicInformation } from '../conversation'

export enum NodeType {
  // Real Full Nodes
  pingmeeTrigger = "pingmeeTrigger",
  workflowTrigger = "workflowTrigger",
  whatsapp = "whatsapp",
  assignTags = "assignTags",
  assignAgents = "assignAgent",
  workflowPointer = 'workflowPointer',
  powerlink = 'powerlink',
  if = "if",
  wait = "wait",
  switch = "switch",

  // Non connectable node
  stickyNote = "stickyNote",

  // Nested nodes
  answer = "answer",
  conditionEvaluation = "conditionEvaluation",
  switchCaseEvaluation = "switchCaseEvaluation",
  noSelectionFallback = 'noSelectionFallback'
}

export enum PingmeeTriggerOptions {
  MessageCreated = "Messages Created",
  NewConversationStarted = "New Conversation Started",

  WorkflowTrigger = "Workflow Trigger"
}

export enum ConditionType {
  greaterThan = "Greater than",
  greaterThanOrEqual = "Greater than or equal",
  lessThan = "Less than",
  lessThanOrEqual = "Less than or equal",
  equals = "Equals",
  notEqual = 'Not Equal',
  contains = "Contains",
  isEmpty = "Is Empty",
  isNotEmpty = "Is Not Empty",
}

export type NodeSpecificData =
  & IfNodeData
  & TriggerNodeData
  & MessageNodeData
  & SubNodeFallbackData
  & SubNodeData
  & GeneralNodeData
  & assignAgentsData
  & assignTagsData
  & WorkflowPointerNodeData
  & WaitNodeData
  & SwitchCaseNodeData

// Base data structure for all nodes
export interface GeneralNodeData extends Record<string, unknown> {
  description?: string;
  variables?: { [key: string]: Variable }
  possibilities?: { [key: string]: { [key: string]: string[] } }
  index?: number;
  subNodesLength?: number;
  subNodesConfig?: SubNodeConfigType;
  isActive?: boolean
}

export enum ConditionEvaluationMode {
  all = 'ALL',
  any = 'ANY'
}

// Specific data structure for If nodes
export interface IfNodeData extends GeneralNodeData {
  evaluationMode?: ConditionEvaluationMode; // All conditions or at least one condition
  conditions?: Condition[];
}

export interface assignTagsData extends GeneralNodeData {
  selectedTags?: ConversationTag[];
}

export interface assignAgentsData extends GeneralNodeData {
  selectedAgents?: UserPublicInformation[];
}

// Specific data structure for If nodes
export interface SubNodeData extends GeneralNodeData {
  label?: string,
  editable?: boolean
}

export type TimerInfo = {
  numberOfSeconds: number
  hours: string,
  minutes: string,
  seconds: string
}

export interface SubNodeFallbackData extends SubNodeData {
  shouldSendReplyMessage?: boolean
  unknownAnswerReplyMessage?: string

  shouldTimeoutExecution?: boolean
  timerInfo?: TimerInfo
}

// Specific data structure for Trigger nodes
export interface TriggerNodeData extends GeneralNodeData {
  eventType?: string; // e.g., "onMessage" or "onNewConversation"
}

// Specific data structure for Message nodes
export interface MessageNodeData extends GeneralNodeData {
  waitForUserResponse?: boolean
  templateInformation?: TemplateInformation
  headerVariables?: { [key: number]: Variable }
  bodyVariables?: { [key: number]: Variable }
}

export interface WorkflowPointerNodeData extends GeneralNodeData {
  workflowId?: string;
  workflowFolderId?: string
  workflowName?: string
}

export interface WaitNodeData extends GeneralNodeData {
  timerInfo?: TimerInfo
}

export interface SwitchCaseNodeData extends GeneralNodeData {
  cases?: IfNodeData[]
}