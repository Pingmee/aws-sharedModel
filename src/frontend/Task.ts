import { AgentIdentification, Conversation } from './conversation.js'

export enum TaskStatusCase {
  open = 'open',
  inProgress = 'standby',
  completed = 'completed',
  closed = 'closed'
}

export interface Task {
  title: string
  body: string

  associatedTo: string
  statusCase: TaskStatusCase
  unreadCount: number

  agentIdentification: AgentIdentification
  assignedAgentIds?: string[]
  viewedByAgentIds?: string[]

  createdAt: number
  updatedAt: number
  dueDate: number

  isRecurring: boolean
  recurringAtDate: number

  participantsIdentifiers?: string
  conversation?: Conversation
}