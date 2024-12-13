import AWS from 'aws-sdk'
import crypto from 'crypto'
import { v4 } from 'uuid'
import cf from 'aws-cloudfront-sign'
import dotenv from 'dotenv'
import { DeleteObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3.js'

dotenv.config()
const s3 = new AWS.S3()

export enum Encoding {
  base64 = 'base64',
  utf8 = 'utf-8'
}

export class Storage {
  static async putObject(associatedTo: string, fileName: string, data: any, mimeType: string, encoding?: Encoding) {
    const filePath = `${this.hashString(associatedTo)}/${fileName}`
    const params: PutObjectRequest = {
      Bucket: process.env.STORAGE_BUCKET as string,
      Key: filePath, // Specify the key (filename) for the image
      Body: encoding ? Buffer.from(data, encoding) : Buffer.from(data), // Specify the image data (buffer or stream)
      ContentType: mimeType, // Specify the content type of the image
    }

    // console.log(`Storage-putObject: params ${JSON.stringify(params)}`);
    const result = await s3.putObject(params).promise()
    console.log(result.$response)
    if (result.$response.error) {
      console.log('Failed writing to s3', result.$response.error)
      throw new Error(`Failed writing to s3 ${result.$response.error}`)
    }
    return `https://d1uf09zmenfbie.cloudfront.net/${filePath}`
  }

  static async removeObject(filePath: string) {
    const params: DeleteObjectRequest = {
      Bucket: process.env.STORAGE_BUCKET as string,
      Key: filePath,
    }

    const result = await s3.putObject(params).promise()
    console.log(result.$response)
    if (result.$response.error) {
      console.log('Failed Deleting file from s3', result.$response.error)
    }
  }

  static async getSignedUrl(url_expiration_seconds: number, mimeType: string, fileName: string, associatedTo: string) {
    const filePath = `${this.hashString(associatedTo)}/${v4()}.${mimeType.split('/')[1]}`
    const s3Params = {
      Bucket: process.env.STORAGE_BUCKET as string,
      Key: filePath,
      Expires: url_expiration_seconds,
      ContentType: mimeType,
    }
    const signedUploadUrl = await s3.getSignedUrlPromise('putObject', s3Params)
    const path = `https://d1uf09zmenfbie.cloudfront.net/${filePath}`
    return {
      signedUploadUrl: signedUploadUrl,
      s3Path: path,
    }
  }

  static signUrl(url: string): string {
    if (!url.includes('cloudfront.net')) {
      return url
    }

    if (!process.env.CLOUDFRONT_KEY_PAIR_ID) {
      throw new Error('Missing cloudfrontKeyPairId in environment variable')
    }

    const options = {
      keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
      expireTime: Date.now() + 1000 * 60 * 60 * 24,
      privateKeyString: process.env.CLOUDFRONT_PRIVATE_KEY,
    }
    return cf.getSignedUrl(url, options)
  }

  private static hashString(input: string): string {
    // Create a hash object using SHA-256 algorithm
    const hash = crypto.createHash('sha256')

    // Update the hash object with the input string
    hash.update(input)

    // Get the hashed value in hexadecimal format
    return hash.digest('hex')
  }
}



