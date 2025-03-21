import {
  Action,
  Footer,
  Header,
  ReplyButton,
  Section,
  WhatsAppComponentButtonType,
  WhatsAppComponentType
} from './whatsapp'


export type TemplateSendComponentParameter = {
  type: TemplateSendComponentType
  text?: string
  coupon_code?: string
  payload?: string
  image?: TemplateSendMessageComponentAttachment
  video?: TemplateSendMessageComponentAttachment
  document?: TemplateSendMessageComponentAttachment & {
    filename: string
  }
  currency?: TemplateSendMessageComponentCurrency
  date_time?: TemplateSendMessageComponentDateTime
}

export type TemplateSendMessageComponentDateTime = {
  fallback_value: string,
  code: string,
  amount_1000: number
}

export type TemplateSendMessageComponentCurrency = {
  fallback_value: string
  day_of_week: number
  year: number
  month: number
  day_of_month: number
  hour: number
  minute: number
  calendar: string
}

export type TemplateSendMessageComponentAttachment = {
  link?: string;
  id?: string
}

export type TemplateComponent = {
  type: WhatsAppComponentType;
  sub_type?: WhatsAppComponentButtonType,
  index?: string
  text?: string;
  sections?: Section[];
  parameters?: TemplateSendComponentParameter[];
};

export type Template = {
  name: string;
  language: { code: string; };
  components: TemplateComponent[];
}

export type TemplateSendMessage = {
  messaging_product: 'whatsapp';
  recipient_type?: 'individual';
  type: string;
  to: string;
  from?: string;
  template?: Template;
  interactive?: InteractiveList | InteractiveSendButton;
  text?: { body: string };
  context?: { message_id: string }
  filename?: string
};

export const enum TemplateSendComponentType {
  image = 'image',
  text = 'text',
  document = 'document',
  footer = 'footer',
  video = 'video',
  buttons = 'buttons',
  button = 'button',
  payload = 'payload',
  coupon_code = 'coupon_code'
}

export type BaseInteractive = {
  header?: Header
  footer?: Footer
  body: {
    text: string;
  };
}


export type InteractiveList = BaseInteractive & {
  type: 'list';
  action: Action;
};

//Not used?
export type InteractiveSendButton = BaseInteractive & {
  type: 'button';
  body: { text: string },
  action: {
    buttons: {
      type: WhatsAppComponentButtonType;
      reply: ReplyButton;
    }[];
  },
};
