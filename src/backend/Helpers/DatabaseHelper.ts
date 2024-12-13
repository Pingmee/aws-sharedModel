import { DynamoDBClient, ReturnValue, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb'
import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb/dist-types/commands'
import dotenv from 'dotenv'

interface Attributes {
  [key: string]: any
}

dotenv.config()

export enum Table {
  businessSettings = 'BusinessSettings',
  connectedPlatforms = 'ConnectedPlatforms',
  serviceTokens = 'ServiceTokens',
  messages = 'Messages',
  reactions = 'Reactions',
  conversations = 'Conversations',
  customers = 'Customers',
  attachments = 'Attachments',
  users = 'Users',
  phoneNumbers = 'PhoneNumbers',
  activeConnectionsTable = 'ActiveConnectionsTable',
  connectionMappingTable = 'ConnectionMapping',
  conversationTags = 'ConversationTags',
  automationSettings = 'AutomationSettings',
  PushSubscriptions = 'PushSubscriptions',
  Webhooks = 'Webhooks',
  PersonalTokens = 'PersonalTokens',
  MessageTemplates = 'MessageTemplates'
}

export enum Index {
  PhoneNumberIdIndex = 'PhoneNumberIdIndex',
  PhoneNumberIdUpdatedAtIndex = 'PhoneNumberIdUpdatedAtIndex',
  MessagesUpdatedAtIndex = 'MessagesUpdatedAtIndex',
  ParticipantsIdentifiers = 'ParticipantsIdentifiers',
  AssociatedToIndex = 'AssociatedToIndex',
  AssociatedToAgent = 'AssociatedToAgentIndex',
  AssociatedToMessageIdIndex = 'AssociatedToMessageIdIndex',
  AssociatedToWithWebhookEventIndex = 'AssociatedToWithWebhookEventIndex',
  ConnectionIdIndex = 'ConnectionIdIndex',
  PlatformTypeIndex = 'PlatformTypeIndex',
  CompanyTemplatesIndex = 'CompanyTemplatesIndex',
  PrivateTemplatesIndex = 'PrivateTemplatesIndex'
}

// let dynamoDB: DynamoDBClient

// if (process.env.IS_OFFLINE) {
//   dynamoDB = new DynamoDBClient({
//     region: 'localhost',
//     endpoint: 'http://0.0.0.0:8000',
//     credentials: {
//       accessKeyId: 'MockAccessKeyId',
//       secretAccessKey: 'MockSecretAccessKey',
//     },
//   })
// } else {

const dynamoDB = new DynamoDBClient({
  region: process.env.REGION, // specify your region
})
// }

const client = DynamoDBDocumentClient.from(dynamoDB, {
  marshallOptions: {
    removeUndefinedValues: true
  }
})

export class DynamoDb {
  static async putItem(params: PutCommandInput) {
    console.log(`Try putting ${params.TableName}`)

    try {
      const command = new PutCommand(params)
      const response = await client.send(command)
      console.log('Item put successfully:', response.Attributes)
      return response
    } catch (error) {
      console.error('Failed to put item:', error)
      throw error
    }
  }

  static async getItem<T>(params: GetCommandInput): Promise<T | undefined> {
    console.log(`Try retrieving ${params.TableName}`)

    try {
      const command = new GetCommand(params)
      const response = await client.send(command)
      console.log('Item retrieved successfully:', response.Item)
      return response.Item as T
    } catch (error) {
      console.error('Failed to get item:', error)
      return undefined
    }
  }

  static async updateItem(tableName: Table, keyAttributes: Attributes, updateAttributes: Attributes, returnValues: ReturnValue = 'NONE') {
    // Define UpdateItemCommand input object
    console.log(`Try update ${tableName} keyAttributes:${keyAttributes} updateAttributes:${updateAttributes}`)

    const params: UpdateItemCommandInput = {
      TableName: tableName,
      Key: keyAttributes,
      UpdateExpression: 'SET',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ReturnValues: returnValues,
    }

    // Construct update expression and attribute values
    let updateExpression = params.UpdateExpression!
    for (const [key, value] of Object.entries(updateAttributes)) {
      updateExpression += ` #${key} = :${key},`
      params.ExpressionAttributeNames![`#${key}`] = key
      params.ExpressionAttributeValues![`:${key}`] = value
    }
    params.UpdateExpression = updateExpression.slice(0, -1) // Remove trailing comma
    try {
      const command = new UpdateItemCommand(params)
      const response: UpdateItemCommandOutput = await client.send(command)
      console.log('Item updated successfully:', response.Attributes)
      return response
    } catch (error) {
      console.error('Failed to update item:', error)
      throw error
    }
  }

  static async updateItemWithExpression<T>(tableName: Table, keyAttributes: Attributes, updateExpression: string, expressionAttributeValues: any, returnValues: ReturnValue = 'NONE'): Promise<T | undefined> {
    // Define UpdateItemCommand input object
    console.log(`Try update ${tableName} keyAttributes:${keyAttributes} updateExpression:${updateExpression} expressionAttributeValues: ${expressionAttributeValues}`)

    const params: UpdateItemCommandInput = {
      TableName: tableName,
      Key: keyAttributes,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: returnValues,
    }

    try {
      const command = new UpdateItemCommand(params)
      const response: UpdateItemCommandOutput = await client.send(command)
      console.log('Item updated successfully:', response.Attributes)

      if (returnValues === 'NONE') {
        return Promise.resolve(undefined)
      }

      return this.flattenDynamoDBItem(response.Attributes) as T
    } catch (error) {
      console.error('Failed to update item:', error)
      throw error
    }
  }

  private static flattenDynamoDBItem(item: any) {
    const flattenedItem = {}

    for (const key in item) {
      if (Object.hasOwn(item, key)) {
        const value = item[key]
        const dataType = Object.keys(value)[0] // e.g., 'N' or 'S'
        // @ts-expect-error asd
        flattenedItem[key] = value[dataType]
      }
    }

    return flattenedItem
  }

  static async updateOrCreateItem(tableName: Table, keyAttributes: Attributes, updateAttributes: Attributes, addAttributes: Attributes, indexName: Index | null) {
    const queryParams: GetCommandInput = {
      TableName: tableName,
      Key: keyAttributes,
    }
    if (indexName) {
      //@ts-expect-error asd
      queryParams.IndexName = indexName
    }

    console.log(queryParams)

    // Execute QueryCommand to check if item exists based on index
    try {
      const queryCommand = new GetCommand(queryParams)
      const result = await client.send(queryCommand)
      if (!result.Item) {
        // Item not found based on index, create the item
        return this.putItem({
          TableName: tableName,
          Item: { ...keyAttributes, ...addAttributes },
        })
      } else {
        // Item found based on index, update the item
        return this.updateItem(tableName, keyAttributes, updateAttributes)
      }
    } catch (error) {
      console.error('Query item failed:', error)
      throw error
    }
  }

  static async deleteItem(params: DeleteCommandInput) {
    try {
      const command = new DeleteCommand(params)
      const response = await client.send(command)
      console.log('Item deleted successfully:', response.Attributes, params)
      return response
    } catch (error) {
      console.error('Failed to delete item:', error)
      throw error
    }
  }

  static async queryItems(params: QueryCommandInput) {
    console.log(`Start query: ${JSON.stringify(params, undefined, 2)}`)
    try {
      const command = new QueryCommand(params)
      const response = await client.send(command)
      console.log('Query successful:', response.Items)
      return response
    } catch (error) {
      console.error('Failed to query items:', error)
      return undefined
    }
  }

  // static async batchGetItems(params: BatchGetItemCommandInput) {
  //   try {
  //     const command = new BatchGetItemCommand(params);
  //     const response = await client.send(command);
  //     console.log('Batch get successful:', response.Responses);
  //
  //     // Unmarshall the response items
  //     const unmarshalledResponses = {};
  //     if (response.Responses) {
  //       for (const tableName in response.Responses) {
  //         unmarshalledResponses[tableName] = response.Responses[tableName].map(item => unmarshall(item));
  //       }
  //     }
  //
  //     return unmarshalledResponses;
  //   } catch (error) {
  //     console.error('Failed to get items in batch:', error);
  //     return undefined;
  //   }
  // }

  static async queryItemCount(table: Table, attributeName: string, attributeValue: string, key: string, value: string, index?: Index) {
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, string> = {}

    expressionAttributeNames[`#${attributeName}`] = key
    expressionAttributeValues[`:${attributeValue}`] = value

    const queryCommand = index ? new QueryCommand({
      TableName: table,
      IndexName: index,
      KeyConditionExpression: `#${attributeName} = :${attributeValue}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      Select: 'COUNT',
    }) : new QueryCommand({
      TableName: table,
      KeyConditionExpression: `#${attributeName} = :${attributeValue}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      Select: 'COUNT',
    })

    const response = await client.send(queryCommand)
    return response.Count || 0
  }

  static async scanItems<T>(params: ScanCommandInput): Promise<T> {
    try {
      const command = new ScanCommand(params)
      const response = await client.send(command)
      console.log('Scan successful:', response.Items)
      return response.Items as T
    } catch (error) {
      console.error('Failed to scan items:', error)
      throw error
    }
  }
}