export enum WebhookEvent {
  conversationCreated = 'conversationCreated',
  conversationUpdated = 'conversationUpdated',
  messageCreated = 'messageCreated',
  messageUpdated = 'messageUpdated'
}

export type Webhook = {
  id: string,
  associatedTo: string
  url: string,
  event: WebhookEvent
}

export type DBEvaluationKeys = {
  startKey: any;
  limit: number;
};

export type GetMessagesBody = DBEvaluationKeys & {
  phoneNumberId: string;
  targetPhoneNumberId: string;
};

export interface AutomationSettings {
  associatedTo: string
  automationWhatsAppTriggerUrl: string
  automationServerUrl: string
}

export type CustomPushSubscription = {
  userId: string,
  associatedTo: string,
  endpoint: string,
  expirationTime?: number,
  keys: {
    p256dh: string,
    auth: string
  }
}

export type PushNotificationPayload = {
  title: string,
  body: string,
  icon: string,
  badge?: string,
  data?: {
    url: string,
    extraInfo: string
  },
  vibrate?: number[],
  actions?: [
    {
      action: 'open_url',
      title: string,
      icon: string
    },
    {
      action: 'dismiss',
      title: string,
      icon: string
    }
  ]
}

export type DeviceIdentity = {
  vendor?: string
  model?: string
  browser?: string
}