import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
  APIGatewayRequestAuthorizerEventHeaders,
  APIGatewayRequestAuthorizerEventMultiValueHeaders,
  APIGatewayTokenAuthorizerEvent, StatementEffect
} from 'aws-lambda'
import { valueFromCookie } from '../Utils/Utils.js'
import { ExtractedUserJWTPayload, User } from '../../frontend/conversation.js'
import jwt, { Secret } from 'jsonwebtoken'

export const extractToken = (event: APIGatewayRequestAuthorizerEvent | APIGatewayTokenAuthorizerEvent): string | undefined => {
  if (isRequestAuthorizerEvent(event)) {
    const tokenFromCookie = getTokenFromCookie(event.multiValueHeaders, 'accessToken')
    if (tokenFromCookie) return tokenFromCookie

    const tokenFromHeader = getTokenFromHeader(event.headers)
    if (tokenFromHeader) return tokenFromHeader

    if (event.queryStringParameters && event.queryStringParameters.token) {
      console.log('Token found in query string parameters')
      return event.queryStringParameters.token
    }
  } else if (isTokenAuthorizerEvent(event)) {
    console.log('Token found in authorizationToken field')
    if (event.authorizationToken.includes('refreshToken=') || event.authorizationToken.includes('accessToken=')) {
      return valueFromCookie([event.authorizationToken], 'accessToken')
    }
    return event.authorizationToken.replace('Bearer ', '')
  }

  return undefined
}

export const isRequestAuthorizerEvent = (event: APIGatewayRequestAuthorizerEvent | APIGatewayTokenAuthorizerEvent): event is APIGatewayRequestAuthorizerEvent => {
  return 'multiValueHeaders' in event
}

export const isTokenAuthorizerEvent = (event: APIGatewayRequestAuthorizerEvent | APIGatewayTokenAuthorizerEvent): event is APIGatewayTokenAuthorizerEvent => {
  return 'authorizationToken' in event
}

export const getTokenFromCookie = (multiValueHeaders: APIGatewayRequestAuthorizerEventMultiValueHeaders | null, cookieName: string): string | undefined => {
  if (multiValueHeaders) {
    const cookieHeader = multiValueHeaders.Cookie ?? multiValueHeaders.cookie
    if (cookieHeader) {
      const accessToken = valueFromCookie(cookieHeader, cookieName)
      console.log(`Token ${accessToken ? 'found' : 'not found'} in cookies`)
      return accessToken
    }
  }
  return undefined
}


export const getTokenFromHeader = (headers: APIGatewayRequestAuthorizerEventHeaders | null): string | null => {
  if (headers) {
    const authorizationHeader = headers.Authorization ?? headers.authorization
    if (authorizationHeader) {
      console.log('Token found in Authorization header')
      return authorizationHeader.replace('Bearer ', '')
    }
  }
  return null
}

export const generatePolicy = (principalId: string, effect: StatementEffect, resource: string, context: User): APIGatewayAuthorizerResult => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context: context,
    usageIdentifierKey: 'qyDZiFKVUp1Hd1nHLDaDi9YK6Bb3gBAy23SYbG46',
  }
}

export async function validateToken(token: string, secret: Secret): Promise<ExtractedUserJWTPayload> {
  try {
    const decodedToken = jwt.verify(token, secret) as ExtractedUserJWTPayload;
    if (!decodedToken.iat) {
      throw new Error('Token does not contain an exp field');
    }

    return decodedToken;
  } catch (error: any) {
    // Differentiating error types (jwt expiration error vs other errors)
    if (error.name === 'TokenExpiredError') {
      console.error('Token expired');
    } else {
      console.error('Token verification failed:', error.message);
    }
    throw new Error('Unauthorized');
  }
}