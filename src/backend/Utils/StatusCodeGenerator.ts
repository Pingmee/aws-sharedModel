// Enum representing HTTP status codes
import { APIGatewayProxyResult } from 'aws-lambda'

export enum HttpStatus {
  // Informational responses (100-199)
  CONTINUE = 100, // The server has received the request headers and the client should proceed to send the request body
  SWITCHING_PROTOCOLS = 101, // The requester has asked the server to switch protocols and the server has agreed to do so

  // Successful responses (200-299)
  OK = 200, // Standard response for successful HTTP requests
  CREATED = 201, // The request has been fulfilled, resulting in the creation of a new resource
  ACCEPTED = 202, // The reqOuest has been accepted for processing, but the processing has not been completed
  NO_CONTENT = 204, // The server successfully processed the request and is not returning any content

  // Redirection messages (300-399)
  MOVED_PERMANENTLY = 301, // The requested resource has been permanently moved to a new URL
  FOUND = 302, // The requested resource has been temporarily moved to a different URL
  SEE_OTHER = 303, // The response to the request can be found under a different URL
  NOT_MODIFIED = 304, // Indicates that the resource has not been modified since the version specified by the request headers

  // Client error responses (400-499)
  BAD_REQUEST = 400, // The server cannot or will not process the request due to a client error
  UNAUTHORIZED = 401, // The request has not been applied because it lacks valid authentication credentials for the target resource
  FORBIDDEN = 403, // The server understood the request but refuses to authorize it
  NOT_FOUND = 404, // The requested resource could not be found but may be available in the future

  // Server error responses (500-599)
  INTERNAL_SERVER_ERROR = 500, // A generic error message, given when an unexpected condition was encountered and no more specific message is suitable
  NOT_IMPLEMENTED = 501, // The server either does not recognize the request method, or it lacks the ability to fulfill the request
  SERVICE_UNAVAILABLE = 503, // The server is currently unable to handle the request due to temporary overloading or maintenance of the server
}

export class StatusCodeGenerator {
  static sendResponse(code: number, body: string | object, multiValueHeaders?: {
    [header: string]: Array<boolean | number | string>;
  }, allowedOrigin?: string): APIGatewayProxyResult {

    const newBody = typeof body === 'object' ? body : { message: body }
    const origin = allowedOrigin ?? (process.env.IS_OFFLINE ? 'http://localhost:3000' : 'https://chat.pingmee.app')
    console.log(`about to return with origin - ${origin}`)

    const response = {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Origin, X-Api-Key, Content-Type, Accept, Cookie, Authorization',
        'Access-Control-Expose-Headers': 'Set-Cookie',
      },
      multiValueHeaders: multiValueHeaders ?? {},
      body: JSON.stringify(newBody),
    }

    console.log(response)
    return response
  }
}