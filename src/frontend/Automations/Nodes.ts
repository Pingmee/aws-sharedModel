import { Variable } from './automations'
import { TemplateInformation } from '../Whatsapp/template-creation-model'
import { Condition, SubNodeConfigType } from './model'

export enum NodeType {
  pingmeeTrigger = "pingmeeTrigger",
  whatsapp = "whatsapp",
  if = "if",
  answer ="answer",
  conditionEvaluation = "conditionEvaluation",
  stickyNote = "stickyNote"
}

export enum PingmeeTriggerOptions {
  MessageCreated = "Messages Created",
  NewConversationStarted = "New Conversation Started"
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
  & GeneralNodeData; // Add more as needed

// Base data structure for all nodes
export interface GeneralNodeData extends Record<string, unknown> {
  description?: string;
  variables?: { [key: string]: Variable}
  index?: number;
  subNodesLength?: number;
  subNodesConfig?: SubNodeConfigType;
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

// Specific data structure for If nodes
export interface SubNodeData extends GeneralNodeData {
  label: string,
  editable: boolean
}

// Specific data structure for Trigger nodes
export interface TriggerNodeData extends GeneralNodeData {
  eventType?: string; // e.g., "onMessage" or "onNewConversation"
}

// Specific data structure for Message nodes
export interface MessageNodeData extends GeneralNodeData {
  templateInformation?: TemplateInformation
  headerVariables?: { [key: number]: Variable}
  bodyVariables?: { [key: number]: Variable}
}