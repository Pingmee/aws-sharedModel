export enum LoginPlatform {
  email = 'email',
  google = 'google'
}

export type DeviceIdentity = {
  vendor?: string
  model?: string
  browser?: string
}