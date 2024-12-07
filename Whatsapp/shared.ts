import { ReplyButton, Section } from './whatsapp'

export const enum WhatsAppComponentButtonType {
  reply = "reply",
  url = "url",
  phone_number = "phone_number",
  quick_reply = 'quick_reply',
  copy_code = 'copy_code'
}

export type Button = {
  type: WhatsAppComponentButtonType;
  text?: string
  reply?: ReplyButton;
  phone_number?: string;
  url?: string;
  example?: string[] | string
};

export type Action = {
  button: string;
  sections: Section[];
};

export const enum WhatsAppComponentType {
  header = 'header',
  body = 'body',
  footer = 'footer',
  text = 'text',
  buttons = 'buttons',
  button = 'button'
}

export const enum WhatsAppHeaderComponentType {
  none = 'none',
  text = 'text',
  image = 'image',
  video = 'video',
  document = 'document',
  location = 'location',
}