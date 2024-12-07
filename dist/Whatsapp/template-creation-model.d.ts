import { Button, FileMetadata, MessageTemplateType, Section, TemplateRejectionReason, WhatsAppComponentType, WhatsAppHeaderComponentType } from './whatsapp';
export type TemplateCreationComponentExamples = {
    header_handle?: string[];
    header_text?: string[];
    body_text?: string[];
};
export type TemplateCreationComponent = {
    type: WhatsAppComponentType;
    format?: WhatsAppHeaderComponentType;
    text?: string;
    example?: TemplateCreationComponentExamples;
    buttons?: Button[];
    sections?: Section[];
    attachmentS3Id?: string;
};
export type TemplateInformation = {
    id?: string;
    status?: string;
    rejected_reason?: TemplateRejectionReason;
    name: string;
    category: string;
    language: string;
    components: TemplateCreationComponent[];
    allow_category_change: boolean;
    associatedTo?: string;
    associatedToAgent?: string;
    templateName?: string;
    templateType?: MessageTemplateType;
    attachment?: FileMetadata;
};
//# sourceMappingURL=template-creation-model.d.ts.map