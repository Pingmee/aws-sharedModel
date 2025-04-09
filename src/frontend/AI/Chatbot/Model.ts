export enum Status {
  none,
  pending,
  success,
  error
}

export type AIChatBotModel = {
  id: string
  associatedTo: string,
  status: Status
  createdAt: number
  generatorModel: ChatBotGeneratorModel
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