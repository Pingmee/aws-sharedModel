import AWS, { AWSError } from 'aws-sdk'

const
apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: process.env.IS_OFFLINE ? 'http://localhost:3001' : process.env.WSSAPIGATEWAYENDPOINT,
})

export class HttpError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message); // Call the superclass constructor with the message

    this.statusCode = statusCode;

    // Set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, HttpError.prototype);

    // Ensure the name of this error is the name of the class
    this.name = this.constructor.name;

    // Optionally, capture a stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class APIGateway {
  static async sendMessageToClient(connectionId: string, data: string) {
    try {
      // await apiGatewayManagementApi.send(new PostToConnectionCommand({
      //   ConnectionId: connectionId, // the connection ID of the WebSocket client
      //   Data: Buffer.from(data) // data to be sent
      // }));

      await apiGatewayManagementApi.postToConnection({
        ConnectionId: connectionId, // the connection ID of the WebSocket client
        Data: data // data to be sent
      }).promise();

      console.log("Message sent to client:", connectionId);
    } catch (error) {
      if ((error as AWSError).code) {
        const awsError = error as AWSError
        if (awsError.code === 'GoneException') {
          console.log(`Connection ${connectionId} is gone.`);
          // Handle disconnection, e.g., remove connection ID from active connections
        } else if (awsError.code === 'LimitExceededException') {
          console.log('Limit exceeded.');
          // Implement throttling or retry logic
        } else if (awsError.code === 'PayloadTooLargeException') {
          console.log('Payload too large.');
          // Ensure the payload is within the allowed size limit
        } else if (awsError.code === 'ForbiddenException') {
          console.log('Access forbidden.');
          // Check and update IAM policies
        } else if (awsError.code === 'InternalServerErrorException') {
          console.log('Internal server error.');
          // Implement retry logic
        } else if (awsError.code === 'BadRequestException') {
          console.log(`Bad request: ${awsError.message}`);
          if (awsError.message.includes('Invalid connectionId')) {
            console.log(`Invalid connectionId: ${connectionId}`);
            throw new HttpError(`Invalid connectionId: ${connectionId}`, 410)
          }
        }
      } else {
        console.log('An unknown error occurred:', error);
      }
      throw error; // rethrowing the error is important if you want to handle it further up the call stack
    }
  }
}


