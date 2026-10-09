import libphonenumber from 'google-libphonenumber'

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()
const PhoneNumberFormat = libphonenumber.PhoneNumberFormat

export type NormalizedPhoneNumber = {
  phoneNumberId: string
  countryCode: string
}

const EMPTY_PHONE: NormalizedPhoneNumber = { phoneNumberId: '', countryCode: '' }

function asPossibleNumber(candidate: string, region?: string): NormalizedPhoneNumber | null {
  try {
    const parsed = phoneUtil.parse(candidate, region)
    if (!phoneUtil.isPossibleNumber(parsed)) {
      return null
    }
    const countryCode = parsed.getCountryCode()
    if (countryCode == null) {
      return null
    }
    return {
      phoneNumberId: phoneUtil.format(parsed, PhoneNumberFormat.E164).replace(/^\+/, ''),
      countryCode: String(countryCode),
    }
  } catch {
    return null
  }
}

function asValidNumber(candidate: string, region?: string): NormalizedPhoneNumber | null {
  try {
    const parsed = phoneUtil.parse(candidate, region)
    if (!phoneUtil.isValidNumber(parsed)) {
      return null
    }
    return asPossibleNumber(candidate, region)
  } catch {
    return null
  }
}

/**
 * Turn a raw phone into digits-only E.164 (no leading +) plus its calling code.
 * National numbers use `defaultRegion`. A leading + or 00 keeps the country in the number.
 */
export function normalizePhoneNumber(input: unknown, defaultRegion = 'IL'): NormalizedPhoneNumber {
  if (input == null || input === '') {
    return { ...EMPTY_PHONE }
  }

  const raw = String(input).trim()
  const digits = raw.replace(/\D/g, '')
  if (!digits) {
    return { ...EMPTY_PHONE }
  }

  if (raw.startsWith('+') || digits.startsWith('00')) {
    const international = raw.startsWith('+') ? raw : `+${ digits.slice(2) }`
    return asPossibleNumber(international) ?? { ...EMPTY_PHONE }
  }

  // A valid national number in the selected country wins. Otherwise keep a
  // country code already present in the digits, then fall back to the selection.
  const inRegion = asPossibleNumber(raw, defaultRegion)
  if (asValidNumber(raw, defaultRegion)) {
    return inRegion ?? { ...EMPTY_PHONE }
  }

  const international = asValidNumber(`+${ digits }`)
  if (international) {
    return international
  }

  return inRegion ?? { ...EMPTY_PHONE }
}

/** ISO region (IL, US, …) for a number that already includes a calling code. */
export function phoneRegion(input: unknown): string | undefined {
  const { phoneNumberId } = normalizePhoneNumber(input)
  if (!phoneNumberId) {
    return undefined
  }
  try {
    const parsed = phoneUtil.parse(`+${ phoneNumberId }`)
    return phoneUtil.getRegionCodeForNumber(parsed) || undefined
  } catch {
    return undefined
  }
}
