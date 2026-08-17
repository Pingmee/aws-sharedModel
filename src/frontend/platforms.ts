import { PlatformType } from './conversation.js'

export interface SelectablePlatform {
  id: string
  displayId: string
  name: string
  associatedBusinessId: string
  type: PlatformType.instagram | PlatformType.facebookMessenger | PlatformType.whatsapp | PlatformType.greenAPI | PlatformType.web
}

export const PLATFORM_DISPLAY_NAMES: Partial<Record<PlatformType, string>> = {
  [ PlatformType.whatsapp ]: 'WhatsApp',
  [ PlatformType.facebookMessenger ]: 'Facebook Messenger',
  [ PlatformType.instagram ]: 'Instagram',
  [ PlatformType.web ]: 'Pingmee Website',
  [ PlatformType.pingmee ]: 'Pingmee',
  [ PlatformType.fireberry ]: 'Fireberry',
}

export function platformDisplayName(platform: PlatformType): string {
  return PLATFORM_DISPLAY_NAMES[ platform ] ?? platform
}

/** Messaging platforms a Pingmee trigger can listen on. */
export const PINGMEE_TRIGGER_PLATFORMS: PlatformType[] = [
  PlatformType.whatsapp,
  PlatformType.facebookMessenger,
  PlatformType.instagram,
  PlatformType.web,
]