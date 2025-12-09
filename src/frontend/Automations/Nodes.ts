import { Expression, Variable } from './automations'
import { TemplateInformation } from '../Whatsapp/template-creation-model'
import {
  Condition, FacebookSocialPost,
  FireberryAction,
  FireberryWorkflowQuery, InstagramSocialPost,
  MessageNodeType,
  SubNodeConfigType
} from './model'
import {
  AISummarizeData,
  ConversationAnswerMode,
  ConversationStatusCase,
  ConversationTag, LanguageInformation, MessageType,
  PlatformType,
  UserPublicInformation
} from '../conversation'
import { FireberryField, FireberryTable } from "../Campaigns/FireberryModel"
import { MessageTemplateType } from '../Whatsapp/whatsapp'

export enum WorkflowMode {
  demo = "demo",
  social = "social",
  full = "full"
}

export enum NodeType {
  // Real Full Nodes
  pingmeeTrigger = "pingmeeTrigger",
  instagramTrigger = "instagramTrigger",
  facebookTrigger = "facebookTrigger",
  workflowTrigger = "workflowTrigger",
  whatsapp = "whatsapp",
  facebookMessenger = "facebookMessenger",
  instagram = "instagram",
  assignTags = "assignTags",
  assignAgents = "assignAgent",
  updateConversation = 'updateConversation',
  workflowPointer = 'workflowPointer',
  fireberry = 'fireberry',
  if = "if",
  wait = "wait",
  switch = "switch",
  httpRequest = "httpRequest",

  // Non connectable node
  stickyNote = "stickyNote",

  // Nested nodes
  answer = "answer",
  conditionEvaluation = "conditionEvaluation",
  switchCaseEvaluation = "switchCaseEvaluation",
  noSelectionFallback = 'noSelectionFallback',
  awaitResponseTimeout = 'awaitResponseTimeout',
}

export enum EventBridgeTriggerOptions {
  waitNode = 'waitNode',
  campaign = 'campaign',
  noResponseTimeout = 'noResponseTimeout',
  conversation = 'conversation'
}

export enum SocialTriggerOptions {
  CommentOnInstagramPost = "Comment on Instagram Post",
  CommentOnFacebookPost = "Comment on Facebook Post",
}

export enum PingmeeTriggerOptions {
  MessageCreated = "Messages Created",
  NewConversationStarted = "New Conversation Started",
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
  & SocialTriggerNodeData
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
  & FireberryNodeData
  & UpdateConversationData

// Base data structure for all nodes
export interface GeneralNodeData extends Record<string, unknown> {
  description?: string;
  variables?: { [key: string]: Variable }
  possibilities?: { [key: string]: { [key: string]: string[] } }
  index?: number;
  subNodesLength?: number;
  subNodesConfig?: SubNodeConfigType;
  isActive?: boolean
  hasError?: boolean
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

// *depecrated* use updateConversationData
export interface assignTagsData extends GeneralNodeData {
  selectedTags?: ConversationTag[];
}

// *depecrated* use updateConversationData
export interface assignAgentsData extends GeneralNodeData {
  selectedAgents?: UserPublicInformation[];
}

export interface UpdateConversationData extends GeneralNodeData {
  selectedTags?: ConversationTag[];
  selectedAgents?: UserPublicInformation[];
  answerMode?: ConversationAnswerMode
  status?: ConversationStatusCase
  autoTranslation?: LanguageInformation
  aiSummarize?: AISummarizeData
  optoutFromMarketingMessage?: boolean
}

// Specific data structure for If nodes
export interface SubNodeData extends GeneralNodeData {
  label?: string,
  editable?: boolean
  removable?: boolean
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
  platform?: PlatformType
  eventType?: string; // e.g., "onMessage" or "onNewConversation"
}

export interface SocialTriggerNodeData extends TriggerNodeData {
  post?: FacebookSocialPost | InstagramSocialPost
}

// Specific data structure for Message nodes
export interface MessageNodeData extends GeneralNodeData {
  type?: MessageType
  messageType?: MessageNodeType
  templateType?: MessageTemplateType
  platform?: PlatformType
  waitForUserResponse?: boolean
  templateInformation?: TemplateInformation
  headerVariables?: { [key: number]: Variable | Expression }
  bodyVariables?: { [key: number]: Variable | Expression }
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

export interface HTTPRequestNodeData extends GeneralNodeData {
  method: string; // e.g., "GET", "POST", etc.
  url?: string;
  headers?: string[];
  body?: string;
  contentType?: string; // e.g., "application/json", "application/x-www-form-urlencoded"
  queryParams?: { [key: string]: string };
  responseMapping?: { [key: string]: string }; // Optional field for mapping response keys to variables
  timeout?: number; // In milliseconds
  retryCount?: number; // Number of retries if the request fails
}

export interface FireberryNodeData extends GeneralNodeData {
  table?: FireberryTable,
  action?: FireberryAction,
  pageSize?: number,
  pageNumber?: number,
  sortByField?: string,
  sortType?: 'ASC' | 'DEC',
  objectField?: FireberryField,
  objectVariable?: Variable | Expression,
  queries?: FireberryWorkflowQuery[];

  fields?: string[]
  message?: string,
  ownerId?: string,
  fileUrl?: string,
}