import { delay } from '../Utils/Utils.js'

export enum HTTPMethod {
  post = 'POST',
  get = 'GET',
  delete = 'DELETE',
  put = 'PUT'
}

export class BaseProvider {
  static async makeRequest(
    url: string,
    method: HTTPMethod,
    token: string | null | undefined,
    body: object | string | null | undefined = null,
    headers: Record<string, string> | null | undefined = null,
  ) {
    // Use the Headers class for easier header management
    const requestHeaders = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': new URL(url).origin,
    })

    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`)
    }

    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        requestHeaders.set(key, value)
      })
    }

    const params: RequestInit = {
      method: method,
      headers: requestHeaders as Headers,
    }

    if (method === HTTPMethod.post && body) {
      params.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    const response = await fetch(url, params)
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json(); // Parse as JSON
      console.log('Response is JSON:', data);
      return data
    } else {
      const text = await response.text(); // Parse as plain text
      console.log('Response is text:', text);
      return text
    }
  }
}

interface FetchRequest {
  url: string
  headers: object
}

export async function fetchWithDelay(fetchRequest: FetchRequest[], waitTime: number): Promise<void> {
  for (let i = 0; i < fetchRequest.length; i++) {
    const startTime = Date.now(); // Capture the start time of the request

    // Perform the fetch request
    try {
      const response = await fetch(fetchRequest[i].url, fetchRequest[i].headers);
      const data = await response.json();
      console.log(`Data from URL ${i + 1}:`, data);
    } catch (error) {
      console.error(`Error fetching URL ${i + 1}:`, error);
    }

    const elapsedTime = Date.now() - startTime; // Calculate how long the fetch took

    // Calculate the remaining wait time
    const remainingWaitTime = waitTime - elapsedTime;

    // If remaining wait time is positive, delay the next request; otherwise, proceed immediately
    if (remainingWaitTime > 0) {
      await delay(remainingWaitTime);
    }
  }
}

async function retryOperation<T>(
  operation: (...args: any[]) => Promise<T>,
  maxRetries: number,
  delay: number,
  ...args: any[]
): Promise<T | undefined> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}`)
      return await operation(...args)
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error}`)
      if (attempt < maxRetries) {
        // Delay before retrying
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        // Max retries reached, rethrow the error
        throw error
      }
    }
  }
}
