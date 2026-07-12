import { describe, expect, it } from '@jest/globals'
import {
  encodeDynamicUrlButtonSuffix,
  normalizeDynamicUrlSuffix,
  normalizeUrlDoubleSlashes,
  prepareDynamicUrlButtonParameterForSend,
  previewDynamicUrl,
} from './dynamicUrl.js'

describe('normalizeUrlDoubleSlashes', () => {
  it('keeps the scheme double slash and collapses path doubles', () => {
    expect(normalizeUrlDoubleSlashes('https://botz-adventures.co.il//myt-trip/x')).toBe(
      'https://botz-adventures.co.il/myt-trip/x',
    )
    expect(normalizeUrlDoubleSlashes('http://a.com///b//c')).toBe('http://a.com/b/c')
  })
})

describe('normalizeDynamicUrlSuffix', () => {
  it('strips a leading slash when the template already has / before {{1}}', () => {
    expect(
      normalizeDynamicUrlSuffix(
        'https://botz-adventures.co.il/{{1}}',
        '/myt-trip/bulgaria',
      ),
    ).toBe('myt-trip/bulgaria')
  })

  it('keeps a leading slash when the template has no slash before the placeholder', () => {
    expect(
      normalizeDynamicUrlSuffix('https://botz-adventures.co.il{{1}}', '/myt-trip/x'),
    ).toBe('/myt-trip/x')
  })
})

describe('encodeDynamicUrlButtonSuffix', () => {
  it('percent-encodes hebrew path segments and leaves ascii hyphens', () => {
    expect(encodeDynamicUrlButtonSuffix('myt-trip/בולגריה-טיול')).toBe(
      `myt-trip/${ encodeURIComponent('בולגריה-טיול') }`,
    )
  })

  it('does not double-encode an already encoded segment', () => {
    const once = encodeURIComponent('בולגריה')
    expect(encodeDynamicUrlButtonSuffix(once)).toBe(once)
  })
})

describe('prepareDynamicUrlButtonParameterForSend', () => {
  it('normalizes slash then encodes hebrew for Meta', () => {
    expect(
      prepareDynamicUrlButtonParameterForSend(
        '/myt-trip/בולגריה-טיול',
        'https://botz-adventures.co.il/{{1}}',
      ),
    ).toBe(`myt-trip/${ encodeURIComponent('בולגריה-טיול') }`)
  })
})

describe('previewDynamicUrl', () => {
  it('shows a readable url without double slashes', () => {
    expect(
      previewDynamicUrl(
        'https://botz-adventures.co.il/{{1}}',
        '/myt-trip/בולגריה',
      ),
    ).toBe('https://botz-adventures.co.il/myt-trip/בולגריה')
  })
})
