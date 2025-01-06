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

export function dataURLToFile(dataURL: string, fileName: string): File {
  if (!dataURL) {
    throw new Error('Invalid dataURL: The dataURL is empty or undefined.');
  }

  // Split the data URL to extract the MIME type and base64 content
  const arr = dataURL.split(',');
  if (arr.length !== 2) {
    throw new Error('Invalid dataURL format: The dataURL must contain a valid base64 string.');
  }

  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || mimeMatch.length < 2) {
    throw new Error('Invalid MIME type: Could not extract the MIME type from the dataURL.');
  }

  const mime = mimeMatch[1]; // Extract the MIME type
  try {
    const bstr = atob(arr[1]); // Decode the base64 string
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    // Fill the Uint8Array with the binary content
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // Convert the Uint8Array to a Blob and then create a File
    return new File([new Blob([u8arr], { type: mime })], fileName, { type: mime });
  } catch (error) {
    throw new Error(`Error converting base64 to binary: ${error}`);
  }
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