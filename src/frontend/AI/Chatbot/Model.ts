import { BaseSubFolder } from '../../Automations/automations.js'
import { VectorStoreFile } from 'openai/resources/vector-stores'
import type { PlatformType } from '../../conversation.js'

export enum Status {
  none,
  pending,
  success,
  error
}

export type AIChatBotGeneratedContent = {
  trigger: string

  messages: {
    [id: string]: {
      header: string
      body: string
      buttons: string[]
    }
  }
  transitions: {
    [fromId: string]: {
      [buttonLabel: string]: string
    }
  }
}

export type AIChatBotModel = {
  id: string
  associatedTo: string,
  status: Status
  createdAt: number
  generatorModel: ChatBotGeneratorModel
  content: AIChatBotGeneratedContent
}

export type ChatBotGeneratorModel = {
  business: string,
  industry: string,
  audience: string,
  about: string,
  depth: number
  platformType?: PlatformType
}

export type LLMResponse = {
  id: string,
  created: number,
  model: string,
  choices: [
    {
      message: {
        role: string,
        content: string,
      },
      finish_reason: string
    }
  ],
  usage: {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number,
    prompt_tokens_details: {
      cached_tokens: number,
      audio_tokens: number
    },
  },
}

export type AIAgentRole = {
  name: string
  description: string
  instructions: string
  tool?: any
  webhook: string
  allRequired: boolean
}

/** A company saved message this agent may send, and the one line that says when. */
export type AIAgentAllowedCompanyTemplate = {
  templateId: string
  sendWhen: string
}

/**
 * Pingmee-owned original for a vector-store file (S3).
 * Present only for uploads made after editable KB support — legacy OpenAI-only files omit this.
 */
export type VectorStoreFileOrigin = {
  /** Document id stable across versions (not the OpenAI file id). */
  documentId: string
  /** Filename argument passed to Storage.putObject (under the hashed associatedTo prefix). */
  s3FileName: string
  version: number
  displayName: string
}

export type VectorStore = {
  id: string
  files: VectorStoreFile[]
  required: boolean
  fileNamesMapping: { [key: string]: string }
  /** OpenAI file id → S3 original. Missing entry ⇒ delete-only (legacy). */
  fileOrigins?: { [openaiFileId: string]: VectorStoreFileOrigin }
}

export type AIAgent = BaseSubFolder & {
  description?: string
  vectorStore?: VectorStore
  roles: AIAgentRole[]
  profileImage: string
  tokensUsed?: number
  /** Pass the chat to a person and switch the conversation to manual. Off unless set. */
  handoff?: boolean
  /** Apply this business's tags and status. Off unless set. */
  tagsAndStatus?: boolean
  /** Create a task linked to this conversation. Off unless set. */
  tasks?: boolean
  /** Company saved messages this agent may send. Empty means it cannot send any. */
  allowedCompanyTemplates?: AIAgentAllowedCompanyTemplate[]
}