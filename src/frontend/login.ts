export interface GoogleLoginResponse {
  hd?: string
  email: string
  email_verified: boolean
  name: string
  picture: string
  given_name: string
  family_name: string
  iat: string
  exp: string
}

export enum LoginPlatform {
  email = 'email',
  google = 'google'
}

export type DeviceIdentity = {
  vendor?: string
  model?: string
  browser?: string
}