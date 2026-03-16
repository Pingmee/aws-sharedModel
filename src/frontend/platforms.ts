import { PlatformType } from './conversation.js'

export interface SelectablePlatform {
  id: string
  displayId: string
  name: string
  associatedBusinessId: string
  type: PlatformType.instagram | PlatformType.facebookMessenger | PlatformType.whatsapp | PlatformType.greenAPI
}