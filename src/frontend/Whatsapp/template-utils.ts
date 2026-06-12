import { TemplateCarouselCard, TemplateCreationComponent, TemplateInformation } from './template-creation-model.js'
import { WhatsAppComponentType } from './whatsapp.js'

export function isCarouselTemplate(template: TemplateInformation): boolean {
  return !!template.components?.some((component) => component.type.toLowerCase() === WhatsAppComponentType.carousel)
}

export function getCarouselComponent(template: TemplateInformation): TemplateCreationComponent | undefined {
  return template.components?.find((component) => component.type.toLowerCase() === WhatsAppComponentType.carousel)
}

export function getCarouselCards(template: TemplateInformation): TemplateCarouselCard[] {
  return getCarouselComponent(template)?.cards ?? []
}

export function getCardComponent(
  card: TemplateCarouselCard,
  type: WhatsAppComponentType,
): TemplateCreationComponent | undefined {
  return card.components?.find((component) => component.type.toLowerCase() === type)
}
