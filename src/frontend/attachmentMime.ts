import { SupportedMimeTypes } from './Whatsapp/whatsapp.js'

/**
 * Built on first use. whatsapp.ts imports this file, so reading the enum at
 * module scope runs before SupportedMimeTypes is initialized.
 */
function mimeForExtension(ext: string): string | undefined {
  switch (ext) {
    case 'pdf':
      return SupportedMimeTypes.applicationPdf
    case 'txt':
      return SupportedMimeTypes.textPlain
    case 'doc':
      return SupportedMimeTypes.applicationMSWord
    case 'docx':
      return SupportedMimeTypes.applicationDocument
    case 'xls':
      return SupportedMimeTypes.applicationExcel
    case 'xlsx':
      return SupportedMimeTypes.applicationSheet
    case 'ppt':
      return SupportedMimeTypes.applicationPowerpoint
    case 'pptx':
      return SupportedMimeTypes.applicationPresentation
    case 'jpg':
    case 'jpeg':
      return SupportedMimeTypes.imageJpeg
    case 'png':
      return SupportedMimeTypes.imagePng
    case 'webp':
      return SupportedMimeTypes.imageWebp
    case 'mp4':
      return SupportedMimeTypes.videoMp4
    case '3gp':
      return SupportedMimeTypes.video3gpp
    case 'mov':
      return SupportedMimeTypes.videoQuicktime
    case 'aac':
      return SupportedMimeTypes.audioAac
    case 'm4a':
      return SupportedMimeTypes.audioMp4
    case 'mp3':
      return SupportedMimeTypes.audioMpeg
    case 'amr':
      return SupportedMimeTypes.audioAmr
    case 'ogg':
      return SupportedMimeTypes.audioOgg
    case 'opus':
      return SupportedMimeTypes.audioOpus
    case 'zip':
      return SupportedMimeTypes.zip
    default:
      return undefined
  }
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
  const fromExtension = ext ? mimeForExtension(ext) : undefined
  if (fromExtension) {
    return fromExtension
  }

  return mime || 'application/octet-stream'
}
