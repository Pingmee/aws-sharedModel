import {
  Button,
  FileMetadata,
  MessageTemplateType,
  Section,
  TemplateRejectionReason,
  WhatsAppComponentType,
  WhatsAppHeaderComponentType
} from './whatsapp.js'

export type TemplateCreationComponent = {
  type: WhatsAppComponentType;
  format?: WhatsAppHeaderComponentType;
  text?: string;
  example?: TemplateCreationComponentExamples;
  buttons?: Button[];
  sections?: Section[];

  // Used for internal company and private templates
  attachmentS3Id?: string
};

export type TemplateInformation = {
  id?: string
  status?: string;
  rejected_reason?: TemplateRejectionReason

  name: string;
  category: string;
  language: string;
  components: TemplateCreationComponent[];
  allow_category_change: boolean

  // Used for internal company and private templates
  associatedTo?: string,
  associatedToAgent?: string,
  templateName?: string,
  templateType?: MessageTemplateType
  attachment?: FileMetadata
}

export type TemplateCreationComponentExamples = {
  header_handle?: string[],
  header_text?: string[],
  body_text?: string[]
}