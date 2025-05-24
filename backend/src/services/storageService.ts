import AWS from 'aws-sdk';
import { logger } from '../utils/logger';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

export async function uploadToS3(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    logger.error('S3 upload failed:', error);
    throw new Error('File upload failed');
  }
}

export async function deleteFromS3(filename: string): Promise<void> {
  try {
    await s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: filename
    }).promise();
  } catch (error) {
    logger.error('S3 delete failed:', error);
    throw new Error('File deletion failed');
  }
}

export async function getSignedUrl(filename: string, expiresIn: number = 3600): Promise<string> {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Expires: expiresIn
    };

    return s3.getSignedUrl('getObject', params);
  } catch (error) {
    logger.error('S3 signed URL generation failed:', error);
    throw new Error('Failed to generate signed URL');
  }
}

export async function uploadMultipleToS3(
  files: Array<{ buffer: Buffer; filename: string; contentType: string }>
): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => 
      uploadToS3(file.buffer, file.filename, file.contentType)
    );
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    logger.error('Multiple S3 upload failed:', error);
    throw new Error('Multiple file upload failed');
  }
}
