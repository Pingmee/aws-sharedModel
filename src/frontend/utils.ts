export const getLastPathComponent = (url: string) => {
  const components = url.split('/');
  return components[components.length - 1];
};

// Helper function to format time from seconds to MM:SS format
export function formatTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}

// Helper function to pad time values to ensure they are always two digits
function pad(value: number) {
  return value.toString().padStart(2, '0');
}

export function formatFileSize(sizeInBytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let size = sizeInBytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(0)} ${units[unitIndex]}`;
}

export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

export const dateNow = () => Math.floor(new Date().getTime() / 1000)

export function hexToRgba(hex: string, alpha = 0.8) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${ r }, ${ g }, ${ b }, ${ alpha })`;
}

// 1) Keep your original helper (slightly typed)
export function dataURLToFile(dataURL: string, fileName: string): File {
  if (!dataURL) throw new Error('Invalid dataURL: The dataURL is empty or undefined.')

  const arr = dataURL.split(',')
  if (arr.length !== 2) throw new Error('Invalid dataURL format')

  const mimeMatch = arr[0].match(/:(.*?);/)
  if (!mimeMatch?.[1]) throw new Error('Invalid MIME type in dataURL')

  const mime = mimeMatch[1]
  const bstr = atob(arr[1])
  const u8arr = new Uint8Array(bstr.length)
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i)
  return new File([new Blob([u8arr], { type: mime })], fileName, { type: mime })
}

// 2) Minimal JPEG sniff (FF D8 FF)
function isJpegBlob(blob: Blob): Promise<boolean> {
  return blob.slice(0, 3).arrayBuffer().then(buf => {
    const h = new Uint8Array(buf)
    return h[0] === 0xFF && h[1] === 0xD8 && h[2] === 0xFF
  })
}

// 3) Safe toBlob wrapper (handles null + typing)
function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob returned null'))), type, quality)
  })
}

// 4) Ensure **actual** JPEG bytes (re-encode if needed)
export async function ensureJpegFileFromDataUrl(
  dataUrl: string,
  filename: string,
  quality = 1.0
): Promise<File> {
  // First, try to use the data directly
  const file = dataURLToFile(dataUrl.replace(/^data:image\/jpg;/, 'data:image/jpeg;'), filename)

  if (file.type === 'image/jpeg' && (await isJpegBlob(file))) {
    // Already a genuine JPEG
    return file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')
      ? file
      : new File([file], filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? filename : `${filename}.jpg`, { type: 'image/jpeg' })
  }

  // Otherwise, re-encode through a canvas to **guarantee** JPEG bytes
  const img = new (typeof window !== 'undefined' ? window.Image : Image)()
  await new Promise<void>((res, rej) => {
    img.onload = () => res()
    img.onerror = rej
    img.src = dataUrl
  })

  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context not available')
  ctx.drawImage(img, 0, 0)

  const jpegBlob = await canvasToBlob(canvas, 'image/jpeg', quality)
  const safeName = filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? filename : `${filename}.jpg`
  return new File([jpegBlob], safeName, { type: 'image/jpeg' })
}

export function searchAndReplace(obj: any, searchTerm: string, action: (value: string) => string): any {
  // If the current value is a string, check if it contains the search term
  if (typeof obj === 'string' && obj.includes(searchTerm)) {
    return action(obj); // Apply the action and return the modified value
  }

  // If the current value is an object or array, recursively process its properties or elements
  if (typeof obj === 'object' && obj !== null) {
    const newObj = Array.isArray(obj) ? [] : {}; // Handle arrays and objects differently
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        // @ts-ignore
        newObj[key] = searchAndReplace(obj[key], searchTerm, action); // Recursive call
      }
    }
    return newObj;
  }

  // If the current value is neither a string nor an object, return it as-is
  return obj;
}

export function updateAndEncodeCookie(cookieName: string): void {
  // Get all cookies as a string
  const cookies = document.cookie;

  // Search for the specific cookie
  const cookieMatch = cookies.match(new RegExp('(?:^|; )' + cookieName + '=([^;]*)'));

  if (cookieMatch) {
    // Decode the current value to handle any already encoded characters
    const cookieValue = decodeURIComponent(cookieMatch[1]);

    try {
      // Parse the JSON to ensure it's a valid JSON object (if applicable)
      const parsedValue = JSON.parse(cookieValue);

      // Convert the parsed object back to a string
      const stringValue = JSON.stringify(parsedValue);

      // URL encode the value
      const encodedValue = encodeURIComponent(stringValue);

      // Update the cookie with the new encoded value
      document.cookie = `${ cookieName }=${ encodedValue }; path=/;`;
      console.log(`Cookie "${ cookieName }" updated to URL-encoded value.`);
    } catch (error) {
      // If JSON.parse fails, it means the cookie value isn't JSON, so encode it directly
      const encodedValue = encodeURIComponent(cookieValue);
      document.cookie = `${ cookieName }=${ encodedValue }; path=/;`;
      console.log(`Cookie "${ cookieName }" updated to URL-encoded value.`);
    }
  } else {
    console.log(`Cookie "${ cookieName }" not found.`);
  }
}