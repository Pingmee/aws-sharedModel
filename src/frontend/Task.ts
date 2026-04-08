import { AgentIdentification, Conversation, Customer } from './conversation.js'

export enum TaskStatusCase {
  open = 'open',
  inProgress = 'standby',
  completed = 'completed'
}

export interface Task {
  taskId: string
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
  recurringAtDate?: number

  // If we want to filter all Tasks for a specific platform id
  phoneNumberId?: string

  participantsIdentifiers?: string
  customer?: Partial<Customer>
  conversation?: Conversation
}