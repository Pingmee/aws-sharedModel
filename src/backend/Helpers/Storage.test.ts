// import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals'
// import AWS from 'aws-sdk';
// import { Storage } from './StorageHelper.js';
// import { afterEach } from 'node:test'
// const s3 = new AWS.S3()
//
// describe('Storage.putObject', () => {
//   it ('', () => {})
//   // const mockBucketName = 'test-bucket';
//   // const mockCloudfrontURL = 'https://d1uf09zmenfbie.cloudfront.net';
//   //
//   // beforeAll(() => {
//   //   process.env.STORAGE_BUCKET = mockBucketName;
//   //   process.env.CLOUDFRONT_URL = mockCloudfrontURL;
//   // });
//   //
//   // afterAll(() => {
//   //   delete process.env.STORAGE_BUCKET;
//   //   delete process.env.CLOUDFRONT_URL;
//   // });
//   //
//   // afterEach(() => {
//   //   jest.restoreAllMocks();
//   // });
//   //
//   // const createMockS3Response = (error: Error | null = null) => ({
//   //   $response: {
//   //     error,
//   //   },
//   // });
//   //
//   // const setupS3Mock = (mockResponse: any) => {
//   //   return jest.spyOn(AWS.S3.prototype, 'putObject').mockImplementation(() => {
//   //     return {
//   //       promise: jest.fn().mockResolvedValue(mockResponse),
//   //     } as unknown as AWS.Request<AWS.S3.PutObjectOutput, AWS.AWSError>;
//   //   });
//   // };
//   //
//   // it('should upload data to S3 and return cloudfront URL when given valid inputs', async () => {
//   //   const mockResponse = createMockS3Response();
//   //   const s3PutObjectMock = setupS3Mock(mockResponse);
//   //
//   //   const associatedTo = 'user123';
//   //   const fileName = 'test.jpg';
//   //   const data = Buffer.from('test-image-data');
//   //   const mimeType = 'image/jpeg';
//   //
//   //   const result = await Storage.putObject(associatedTo, fileName, data, mimeType);
//   //
//   //   expect(s3PutObjectMock).toHaveBeenCalledWith({
//   //     Bucket: mockBucketName,
//   //     Key: expect.stringContaining(fileName),
//   //     Body: data,
//   //     ContentType: mimeType,
//   //   });
//   //
//   //   expect(result).toMatch(/^https:\/\/d1uf09zmenfbie\.cloudfront\.net\/.+\/test\.jpg$/);
//   // });
//   //
//   // it('should throw error when S3 upload fails', async () => {
//   //   const mockError = new Error('S3 Upload Failed');
//   //   const mockResponse = createMockS3Response(mockError);
//   //   const s3PutObjectMock = setupS3Mock(mockResponse);
//   //
//   //   const associatedTo = 'user123';
//   //   const fileName = 'test.jpg';
//   //   const data = Buffer.from('test-image-data');
//   //   const mimeType = 'image/jpeg';
//   //
//   //   await expect(Storage.putObject(associatedTo, fileName, data, mimeType)).rejects.toThrow('Failed writing to s3');
//   //
//   //   expect(s3PutObjectMock).toHaveBeenCalled();
//   // });
//   //
//   // it('should create correct S3 params with bucket, key, and content type when valid inputs are provided', async () => {
//   //   const mockResponse = createMockS3Response();
//   //   const s3PutObjectMock = setupS3Mock(mockResponse);
//   //
//   //   const associatedTo = 'user123';
//   //   const fileName = 'test.jpg';
//   //   const data = Buffer.from('test-image-data');
//   //   const mimeType = 'image/jpeg';
//   //
//   //   const result = await Storage.putObject(associatedTo, fileName, data, mimeType);
//   //
//   //   expect(s3PutObjectMock).toHaveBeenCalledWith({
//   //     Bucket: mockBucketName,
//   //     Key: expect.stringContaining(fileName),
//   //     Body: data,
//   //     ContentType: mimeType,
//   //   });
//   //
//   //   expect(result).toMatch(/^https:\/\/d1uf09zmenfbie\.cloudfront\.net\/.+\/test\.jpg$/);
//   // });
//   //
//   // it('should generate correct file path using hashed associatedTo and fileName', async () => {
//   //   const mockResponse = createMockS3Response();
//   //   const s3PutObjectMock = setupS3Mock(mockResponse);
//   //
//   //   const associatedTo = 'user123';
//   //   const fileName = 'test.jpg';
//   //   const data = Buffer.from('test-image-data');
//   //   const mimeType = 'image/jpeg';
//   //
//   //   const result = await Storage.putObject(associatedTo, fileName, data, mimeType);
//   //
//   //   const expectedFilePath = `${Storage["hashString"](associatedTo)}/${fileName}`;
//   //   expect(s3PutObjectMock).toHaveBeenCalledWith({
//   //     Bucket: mockBucketName,
//   //     Key: expectedFilePath,
//   //     Body: data,
//   //     ContentType: mimeType,
//   //   });
//   //
//   //   expect(result).toBe(`${mockCloudfrontURL}/${expectedFilePath}`);
//   // });
//   //
//   // it('should throw an error when STORAGE_BUCKET environment variable is missing', async () => {
//   //   delete process.env.STORAGE_BUCKET;
//   //
//   //   const s3PutObjectMock = setupS3Mock(createMockS3Response());
//   //
//   //   const associatedTo = 'user123';
//   //   const fileName = 'test.jpg';
//   //   const data = Buffer.from('test-image-data');
//   //   const mimeType = 'image/jpeg';
//   //
//   //   await expect(Storage.putObject(associatedTo, fileName, data, mimeType)).rejects.toThrow('Failed writing to s3');
//   //
//   //   expect(s3PutObjectMock).not.toHaveBeenCalled();
//   //
//   //   process.env.STORAGE_BUCKET = mockBucketName; // Restore for remaining tests
//   // });
//   //
//   // it('should return correctly formatted cloudfront URL when object is uploaded successfully', async () => {
//   //   const mockResponse = createMockS3Response();
//   //   const s3PutObjectMock = setupS3Mock(mockResponse);
//   //
//   //   const associatedTo = 'user123';
//   //   const fileName = 'test.jpg';
//   //   const data = Buffer.from('test-image-data');
//   //   const mimeType = 'image/jpeg';
//   //
//   //   const result = await Storage.putObject(associatedTo, fileName, data, mimeType);
//   //
//   //   expect(s3PutObjectMock).toHaveBeenCalledWith({
//   //     Bucket: mockBucketName,
//   //     Key: expect.stringContaining(fileName),
//   //     Body: data,
//   //     ContentType: mimeType,
//   //   });
//   //
//   //   expect(result).toMatch(/^https:\/\/d1uf09zmenfbie\.cloudfront\.net\/.+\/test\.jpg$/);
//   // });
// });