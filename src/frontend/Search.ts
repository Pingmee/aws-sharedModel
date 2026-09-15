export type SearchEntityKind = 'customer' | 'conversation' | 'task'

/** Lean indexed document — searchable text + structured filter fields (not full Dynamo JSON). */
export type SearchDocument = {
  type: SearchEntityKind
  associatedTo: string

  customerName?: string
  customerNickname?: string
  phoneNumber?: string
  phoneDigits?: string
  parsedPhoneNumber?: string
  phoneNumberId?: string
  email?: string

  title?: string
  body?: string

  conversationId?: string
  taskId?: string
  participantsIdentifiers?: string
  customerPhoneNumberId?: string

  statusCase?: string
  answerMode?: string
  assignedAgentIds?: string[]
  assignedTagIds?: string[]
  unreadCount?: number
  isRecurring?: boolean

  createdAt?: number
  updatedAt?: number
  dueDate?: number
  lastActiveAt?: number
}

/** Structured filters applied as OpenSearch term/terms/range (not free-text). */
export type SearchFilters = {
  statusCase?: string | string[]
  answerMode?: string | string[]
  assignedAgentIds?: string[]
  assignedTagIds?: string[]
  phoneNumberId?: string
  unread?: boolean
  isRecurring?: boolean
  updatedAtFrom?: number
  updatedAtTo?: number
  createdAtFrom?: number
  createdAtTo?: number
  dueDateFrom?: number
  dueDateTo?: number
}

export type SearchRequest = {
  /** Free-text query (names, phones, title, body). Empty string allowed when only filters are set. */
  q: string
  kinds?: SearchEntityKind[]
  /** Page size (default 25, max 100). Prefer 50 for inbox search. */
  limit?: number
  /** Offset into the result set for pagination (OpenSearch `from`). */
  from?: number
  filters?: SearchFilters
}

export type SearchCustomerHit = {
  type: 'customer'
  associatedTo: string
  phoneNumberId: string
  customerName?: string
  customerNickname?: string
  phoneNumber?: string
}

export type SearchConversationHit = {
  type: 'conversation'
  associatedTo: string
  conversationId: string
  participantsIdentifiers: string
  phoneNumberId?: string
  customerName?: string
  customerNickname?: string
  phoneNumber?: string
  statusCase?: string
}

export type SearchTaskHit = {
  type: 'task'
  associatedTo: string
  taskId: string
  title?: string
  conversationId?: string
  customerNickname?: string
  phoneNumber?: string
  statusCase?: string
}

export type SearchHit = SearchCustomerHit | SearchConversationHit | SearchTaskHit

export type SearchResponse = {
  customers: SearchCustomerHit[]
  conversations: SearchConversationHit[]
  tasks: SearchTaskHit[]
  /** True when this page was full — caller can request the next `from`. */
  hasMore?: boolean
}
