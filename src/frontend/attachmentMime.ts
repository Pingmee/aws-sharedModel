import { SupportedMimeTypes } from './Whatsapp/whatsapp.js'

const EXTENSION_TO_MIME: Record<string, string> = {
  pdf: SupportedMimeTypes.applicationPdf,
  txt: SupportedMimeTypes.textPlain,
  doc: SupportedMimeTypes.applicationMSWord,
  docx: SupportedMimeTypes.applicationDocument,
  xls: SupportedMimeTypes.applicationExcel,
  xlsx: SupportedMimeTypes.applicationSheet,
  ppt: SupportedMimeTypes.applicationPowerpoint,
  pptx: SupportedMimeTypes.applicationPresentation,
  jpg: SupportedMimeTypes.imageJpeg,
  jpeg: SupportedMimeTypes.imageJpeg,
  png: SupportedMimeTypes.imagePng,
  webp: SupportedMimeTypes.imageWebp,
  mp4: SupportedMimeTypes.videoMp4,
  '3gp': SupportedMimeTypes.video3gpp,
  mov: SupportedMimeTypes.videoQuicktime,
  aac: SupportedMimeTypes.audioAac,
  m4a: SupportedMimeTypes.audioMp4,
  mp3: SupportedMimeTypes.audioMpeg,
  amr: SupportedMimeTypes.audioAmr,
  ogg: SupportedMimeTypes.audioOgg,
  opus: SupportedMimeTypes.audioOpus,
  zip: SupportedMimeTypes.zip,
}

/** File extension from the last dot in the name (e.g. `file.26.pdf` → `pdf`). */
export function getFileExtensionFromName(fileName: string): string | undefined {
  const trimmed = fileName.trim()
  const lastDot = trimmed.lastIndexOf('.')
  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return undefined
  }
  return trimmed.slice(lastDot + 1).toLowerCase()
}

/**
 * Prefer the browser MIME type; when it is missing or generic, infer from the
 * filename extension (using the last dot, not the first).
 */
export function resolveAttachmentMimeType(fileName: string, fileMimeType?: string): string {
  const mime = fileMimeType?.trim()
  if (mime && mime !== 'application/octet-stream') {
    return mime
  }

  const ext = getFileExtensionFromName(fileName)
  if (ext && EXTENSION_TO_MIME[ext]) {
    return EXTENSION_TO_MIME[ext]
  }

  return mime || 'application/octet-stream'
}
