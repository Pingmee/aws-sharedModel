import { BaseSubFolder } from '../../Automations/automations'
import { OpenAI } from 'openai'

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
  tool?: OpenAI.Responses.Tool
  webhook: string
}

export type AIAgent = BaseSubFolder & {
  description?: string
  roles: AIAgentRole[]
  profileImage: string
  tokensUsed?: number
}