import { PlatformType } from './conversation'

export interface SelectablePlatform {
  id: string
  displayId: string
  name: string
  associatedBusinessId: string
  type: PlatformType.instagram | PlatformType.facebookMessenger | PlatformType.whatsapp
}