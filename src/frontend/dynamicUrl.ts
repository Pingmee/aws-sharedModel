/**
 * Helpers for WhatsApp dynamic URL button suffixes (`{{1}}`).
 * Meta requires percent-encoding of special / non-ASCII characters in the send parameter.
 */

/** True when a template URL includes a Meta numbered placeholder such as `{{1}}`. */
export function isDynamicTemplateUrl(url?: string): boolean {
  return Boolean(url && /{{\d+}}/.test(url))
}

/** Collapse accidental `//` in a URL without touching the `https://` (or `http://`) scheme. */
export function normalizeUrlDoubleSlashes(url: string): string {
  return url.replace(/([^:]\/)\/+/g, '$1')
}

/**
 * Strip a leading `/` from the suffix when the template already has a slash before `{{n}}`
 * (avoids `https://host.com/` + `/path` → `https://host.com//path`).
 */
export function normalizeDynamicUrlSuffix(urlTemplate: string | undefined, suffixValue: string): string {
  let suffix = suffixValue.trim()
  if (!suffix) {
    return ''
  }
  if (urlTemplate && /\/{{\d+}}/.test(urlTemplate) && suffix.startsWith('/')) {
    suffix = suffix.replace(/^\/+/, '')
  }
  return suffix
}

/**
 * Percent-encode each path segment for Meta URL button parameters.
 * Keeps `/` as a separator. Safe to call on already-encoded input (decode → encode once).
 */
export function encodeDynamicUrlButtonSuffix(suffix: string): string {
  const trimmed = suffix.trim()
  if (!trimmed) {
    return ''
  }

  return trimmed
    .split('/')
    .map((segment) => {
      if (!segment) {
        return ''
      }
      try {
        return encodeURIComponent(decodeURIComponent(segment))
      } catch {
        return encodeURIComponent(segment)
      }
    })
    .join('/')
}

/**
 * Prepare the URL button parameter text for the WhatsApp send API:
 * normalize leading slash vs template, then percent-encode for Meta.
 */
export function prepareDynamicUrlButtonParameterForSend(
  suffixValue: string,
  urlTemplate?: string,
): string {
  return encodeDynamicUrlButtonSuffix(normalizeDynamicUrlSuffix(urlTemplate, suffixValue))
}

/** Live preview of a dynamic template URL (readable, with double-slash cleanup). */
export function previewDynamicUrl(urlTemplate: string, suffixValue: string): string {
  const suffix = normalizeDynamicUrlSuffix(urlTemplate, suffixValue)
  const replaced = urlTemplate.replace(/{{\d+}}/g, suffix || '{{1}}')
  return normalizeUrlDoubleSlashes(replaced)
}
