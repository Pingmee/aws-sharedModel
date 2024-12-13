import { PushNotificationPayload, UserPublicInformation } from '@pingmee/aws-sharedmodel'
import { APIGatewayEventDefaultAuthorizerContext } from 'aws-lambda'
import libphonenumber from 'google-libphonenumber'
import { countryCodeMap } from './countries.js'
import { CustomPushSubscription, DBEvaluationKeys } from '../backend.js'
import { ActiveConnectionSchemeKeys, DBObjectInterface, User } from '../../frontend/conversation.js'
import { DynamoDb, Index, Table } from '../Helpers/DatabaseHelper.js'
import webPush, { WebPushError } from 'web-push'
import { APIGateway, HttpError } from './../Helpers/APIGatewayHelper.js'
import { StatusCodeGenerator } from './StatusCodeGenerator.js'
import { constants } from 'node:http2'
import { AWSError } from 'aws-sdk'

export function createDateFromInterval(interval: number) {
  const currentDate = new Date()
  return new Date(currentDate.getTime() + interval)
}

export function hasDatePassed(date: Date) {
  const currentDate = new Date() // Get the current date and time
  return currentDate > date // Compare the current date with the target date
}

export function combineParticipantsIdentifiers(identifiers: string[]) {
  return identifiers.sort().join('#')
}

export function combineCountryCodeAndPhoneNumber(countryCode: string, phoneNumber: string) {
  if (countryCode === '972' && phoneNumber.startsWith('0')) {
    return countryCode + phoneNumber.substring(1)
  }
  return countryCode + phoneNumber
}

export function extractUserFromAuthorizerContext(context: APIGatewayEventDefaultAuthorizerContext): UserPublicInformation {
  console.log(`Got context ${ JSON.stringify(context, undefined, 2) }`)
  if (!context) {
    throw new Error('Context cant be empty')
  }

  return findObjectWithKey(context, 'associatedTo') as UserPublicInformation
}

function findObjectWithKey(obj: Record<string, any>, targetKey: string): Record<string, any> {
  // Iterate through each key-value pair in the object
  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue

    // Check if the key matches the target key
    if (key === targetKey) {
      return obj // Return the object containing the target key
    }

    // If the value is an object, search recursively
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const result = findObjectWithKey(obj[key], targetKey)
      if (result) return result // Return the found object
    }
  }

  throw Error(`Did not find associated user in authorizer block ${ obj }`)
}

export const valueFromCookie = (cookies: string[], returnCookieName: string): string | undefined => {
  let returnValue: string | undefined = ''
  cookies.forEach(cookie => {
    const foundValue = cookie.split('; ').find(row => row.startsWith(`${ returnCookieName }=`))
    if (foundValue) {
      returnValue = foundValue.split('=')[1]
    }
  })
  return returnValue
}

export function removeDuplicates(arr: any[], key: string) {
  const seen = new Set()
  return arr.filter(item => {
    const keyValue = item[key]
    if (seen.has(keyValue)) {
      return false
    } else {
      seen.add(keyValue)
      return true
    }
  })
}

export type SocketMessage = {
  type: string,
  value: any,
}

export async function broadcast(message: SocketMessage, associatedTo: string) {
  const activeConnections = await getAllConnectionsAssociatedTo(associatedTo)
  await Promise.all(
    activeConnections.map(async connection => await postToUser(connection.connectionId, message))
  )
}

export async function broadcastPushNotification(associatedTo: string, title: string, body: string, extraInfo?: any) {
  const allAgents = await getAllUserAgentsAssociatedTo(associatedTo)
  try {
    const payload: PushNotificationPayload = {
      title: title,
      body: body,
      data: {
        url: '',
        extraInfo: extraInfo
      },
      icon: 'https://general-bucket-assets.s3.eu-central-1.amazonaws.com/pingmee_symbol_256.png'
    }
    if (allAgents) {
      await Promise.all(
        allAgents.dbObject.map(async agent => await sendNotificationToUserWithId(agent.email, payload))
      )
    }
  } catch (e) {
    console.log(e)
  }
}

export const dateNow = () => Math.floor(new Date().getTime() / 1000)

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Get an instance of PhoneNumberUtil
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()

export const parsePhoneNumber = (phoneNumber: string, countryCode: string) => {
  try {
    // Parse the phone number with the given region (country code)
    const number = phoneUtil.parse(phoneNumber, countryCodeMap[countryCode])

    // Format the number in the national format
    const formattedNational = phoneUtil.format(number, libphonenumber.PhoneNumberFormat.NATIONAL)

    // Format the number in the international format
    const formattedInternational = phoneUtil.format(number, libphonenumber.PhoneNumberFormat.INTERNATIONAL)

    // Validate the phone number
    const isValid = phoneUtil.isValidNumber(number)

    return {formattedNational, formattedInternational, isValid}
  } catch (error) {
    console.error('Error parsing phone number:', error)
    return null
  }
}

export function replaceTemplatePlaceholdersForParameters(template: string, parameters: string[]) {
  return parameters.reduce((result, param, index) => {
    const placeholder = new RegExp(`{{(${index + 1})}}`, 'g')
    return result.replace(placeholder, param)
  }, template)
}

// export function searchAndReplace(obj: any, searchTerm: string, action: (value: string) => string): any {
//   // If the current value is a string, check if it contains the search term
//   if (typeof obj === 'string' && obj.includes(searchTerm)) {
//     return action(obj); // Apply the action and return the modified value
//   }
//
//   // If the current value is an object or array, recursively process its properties or elements
//   if (typeof obj === 'object' && obj !== null) {
//     const newObj = Array.isArray(obj) ? [] : {}; // Handle arrays and objects differently
//     for (const key in obj) {
//       if (Object.hasOwn(obj, key)) {
//         //@ts-ignore
//         newObj[key] = searchAndReplace(obj[key], searchTerm, action); // Recursive call
//       }
//     }
//     return newObj;
//   }
//
//   // If the current value is neither a string nor an object, return it as-is
//   return obj;
// }

export const getAllUserAgentsAssociatedTo = async (associatedTo: string, ExcludedEmail: string | undefined = undefined, evaluationKeys: DBEvaluationKeys | undefined = undefined): Promise<DBObjectInterface<User[]> | undefined> => {
  let filterExpression: string | undefined = undefined
  const expressionAttributeValues: Record<string, any> | undefined = {':associatedTo': associatedTo}

  if (ExcludedEmail) {
    filterExpression = 'email <> :excludedValue'
    expressionAttributeValues[':excludedValue'] = ExcludedEmail
  }

  const output = await DynamoDb.queryItems({
    TableName: Table.users,
    IndexName: Index.AssociatedToIndex,
    KeyConditionExpression: '#associatedTo = :associatedTo',
    FilterExpression: filterExpression,
    ExpressionAttributeNames: {
      '#associatedTo': 'associatedTo'
    },
    ExpressionAttributeValues: expressionAttributeValues,
    ExclusiveStartKey: evaluationKeys?.startKey,
    Limit: evaluationKeys?.limit
  })

  if (!output) {
    return undefined
  }

  return {
    dbObject: output.Items?.length === 0 ? [] : output.Items as User[],
    hasMoreItemsToFetch: output?.LastEvaluatedKey !== undefined,
    lastEvaluatedKey: output?.LastEvaluatedKey
  }
}

export async function getAllConnectionsAssociatedTo(associatedTo: string, excludedKey: string | undefined = undefined, evaluationKeys: DBEvaluationKeys | undefined = undefined): Promise<ActiveConnectionSchemeKeys[]> {
  let filterExpression: string | undefined = undefined
  const expressionAttributeValues: Record<string, any> | undefined = {':associatedTo': associatedTo}

  if (excludedKey) {
    filterExpression = 'associatedToAgent <> :excludedKey'
    expressionAttributeValues[':excludedKey'] = excludedKey
  }

  const output = await DynamoDb.queryItems({
    TableName: Table.activeConnectionsTable,
    KeyConditionExpression: '#associatedTo = :associatedTo',
    FilterExpression: filterExpression,
    ExpressionAttributeNames: {
      '#associatedTo': 'associatedTo'
    },
    ExpressionAttributeValues: expressionAttributeValues,
    ExclusiveStartKey: evaluationKeys?.startKey,
    Limit: evaluationKeys?.limit
  })

  return !output || output.Items?.length === 0 ? [] : output.Items as ActiveConnectionSchemeKeys[]
}

export const getAllConnectionsAssociatedToAgent = async (associatedToAgent: string, excludedKey: string | undefined = undefined, startKey: DBEvaluationKeys | undefined = undefined): Promise<ActiveConnectionSchemeKeys[]> => {
  console.log(`getAllConnectionsAssociatedToAgent ${ associatedToAgent }`)
  let filterExpression: string | undefined = undefined
  let expressionAttributeValues: Record<string, any> | undefined = {':associatedToAgent': associatedToAgent}

  if (excludedKey) {
    filterExpression = 'connectionId <> :excludedKey'
    expressionAttributeValues[':excludedKey'] = excludedKey
  }

  const output = await DynamoDb.queryItems({
    TableName: Table.activeConnectionsTable,
    IndexName: Index.AssociatedToAgent,
    KeyConditionExpression: '#associatedToAgent = :associatedToAgent',
    FilterExpression: filterExpression,
    ExpressionAttributeNames: {
      '#associatedToAgent': 'associatedToAgent'
    },
    ExpressionAttributeValues: expressionAttributeValues,
    ExclusiveStartKey: startKey
  })

  return !output || output.Items?.length === 0 ? [] : output.Items as ActiveConnectionSchemeKeys[]
}

export const postToUser = async (connectionId: string, messageBody: any): Promise<boolean> => {
  try {
    console.log(`Trying to send message to ${ connectionId } with data ${ messageBody }`)
    await APIGateway.sendMessageToClient(connectionId, JSON.stringify(messageBody))
    console.log(`Message sent`)
    return true
  } catch (e) {
    console.log(`Error in sending message ${ e }`)
    if (isConnectionNotExistError(e)) {
      await handleDisconnect(connectionId)
      return false
    } else {
      throw e
    }
  }
}

const isConnectionNotExistError = (e: unknown) =>
  (e as AWSError).statusCode === 410 || (e as HttpError).statusCode === 410

export const handleDisconnect = async (connectionId: string) => {
  const activeConnectionOutput = await DynamoDb.queryItems({
    TableName: Table.activeConnectionsTable,
    IndexName: Index.ConnectionIdIndex,
    KeyConditionExpression: 'connectionId = :connectionId',
    ExpressionAttributeValues: {
      ':connectionId': connectionId
    },
    Limit: 1
  })

  if (!activeConnectionOutput || !activeConnectionOutput.Items || activeConnectionOutput.Items.length === 0) {
    return StatusCodeGenerator.sendResponse(constants.HTTP_STATUS_BAD_REQUEST, `connectionId: ${ connectionId } is not in table`)
  }

  const deletedConnectionOutput = await DynamoDb.deleteItem({
    TableName: Table.activeConnectionsTable,
    Key: {
      associatedTo: activeConnectionOutput.Items[0].associatedTo,
      connectionId: activeConnectionOutput.Items[0].connectionId
    },
    ReturnValues: 'ALL_OLD'
  })

  if (!deletedConnectionOutput || !deletedConnectionOutput.Attributes) {
    return StatusCodeGenerator.sendResponse(constants.HTTP_STATUS_BAD_REQUEST, `connectionId: ${ connectionId } is not in table`)
  }

  const deletedConnection = deletedConnectionOutput.Attributes as ActiveConnectionSchemeKeys
  const isAgentConnectedInOtherDevices = await isAgentConnected(deletedConnection.associatedToAgent)

  if (!isAgentConnectedInOtherDevices) {
    await notifyAgentConnectionsChangedStatus(deletedConnection.associatedTo, ConnectionStatus.disconnected, deletedConnection)
  }

  return StatusCodeGenerator.sendResponse(constants.HTTP_STATUS_OK, '')
}

export async function notifyAgentConnectionsChangedStatus (associatedTo: string, status: ConnectionStatus, newConnection: ActiveConnectionSchemeKeys, excludedKey: string | undefined = undefined){
  const activeConnections = await getAllConnectionsAssociatedTo(associatedTo, excludedKey)

  if (!activeConnections) {
    console.log(`No Active Connections associated to ${ associatedTo }`)
    return
  }

  let newStatus: string = ''

  switch (status) {
    case ConnectionStatus.connected:
      newStatus = 'agentConnected'
      break
    case ConnectionStatus.disconnected:
      newStatus = 'agentDisconnected'
      break
  }

  await Promise.all(
    activeConnections.map(async (connection) => {
      await postToUser(
        connection.connectionId,
        {type: newStatus, value: newConnection}
      )
    })
  )
}

export async function sendNotificationToUserWithId(id: string, payload: PushNotificationPayload) {
  console.log(`sendNotificationToUserWithId to ${ id }`)
  const data = await DynamoDb.queryItems({
    TableName: Table.PushSubscriptions,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': id
    }
  })

  if (!data) {
    throw Error(`data is undefined when fetching push subscription for ${ id }`)
  }

  const subscriptions = (data.Items || []) as CustomPushSubscription[]

  await Promise.all(
    subscriptions.map(async subscription => {
      try {
        return await webPush.sendNotification(subscription, JSON.stringify(payload))
      } catch (error) {
        if ((error as WebPushError).statusCode === 410 || (error as WebPushError).statusCode === 404) {
          // Remove expired subscription
          return DynamoDb.deleteItem({
            TableName: Table.PushSubscriptions,
            Key: {
              userId: id,
              endpoint: subscription.endpoint
            }
          })
        }
        console.error('Error sending notification:', error)
      }
    })
  )
}

export enum ConnectionStatus {
  connected = 'agentConnected',
  disconnected = 'agentDisconnected'
}

export async function isAgentConnected(associatedToAgent: string): Promise<boolean> {
  const connectionCount = await DynamoDb.queryItems({
    TableName: Table.activeConnectionsTable,
    IndexName: Index.AssociatedToAgent,
    KeyConditionExpression: 'associatedToAgent = :associatedToAgent',
    ExpressionAttributeValues: {
      ':associatedToAgent': associatedToAgent
    },
    Select: 'COUNT',
    Limit: 1
  })
  console.log(`connectionCount ${ connectionCount?.Count }`)

  if (!connectionCount || !connectionCount.Count) {
    return false
  }

  return connectionCount.Count > 0
}