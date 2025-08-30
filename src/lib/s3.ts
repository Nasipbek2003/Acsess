import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// S3 Configuration
const S3_CONFIG = {
  accessKeyId: process.env.S3_ACCESS_KEY_ID || 'VILL7AAOSUBNG1GCY61U',
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'w0qQH4DDAq5pTpIgtCcZ1xbA9kTcZzS9br9nDICM',
  endpoint: process.env.S3_ENDPOINT || 'https://s3.twcstorage.ru',
  region: process.env.S3_REGION || 'auto',
  bucketName: process.env.S3_BUCKET_NAME || 'acsess-products'
};

// Create S3 client
export const s3Client = new S3Client({
  endpoint: S3_CONFIG.endpoint,
  region: S3_CONFIG.region,
  credentials: {
    accessKeyId: S3_CONFIG.accessKeyId,
    secretAccessKey: S3_CONFIG.secretAccessKey,
  },
  forcePathStyle: true, // Required for custom endpoints
});

// Upload file to S3
export async function uploadToS3(
  file: Buffer, 
  fileName: string, 
  contentType: string
): Promise<string> {
  const key = `products/${Date.now()}-${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: S3_CONFIG.bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  try {
    console.log('Uploading to S3 with config:', {
      bucket: S3_CONFIG.bucketName,
      key,
      endpoint: S3_CONFIG.endpoint
    });
    
    const result = await s3Client.send(command);
    console.log('S3 upload result:', result);
    
    // Return the public URL
    return `${S3_CONFIG.endpoint}/${S3_CONFIG.bucketName}/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    console.error('S3 Config used:', {
      endpoint: S3_CONFIG.endpoint,
      region: S3_CONFIG.region,
      bucket: S3_CONFIG.bucketName,
      accessKeyId: S3_CONFIG.accessKeyId ? 'Set' : 'Not set'
    });
    throw new Error(`Failed to upload file to S3: ${error}`);
  }
}

// Delete file from S3
export async function deleteFromS3(fileUrl: string): Promise<void> {
  try {
    // Extract key from URL
    const urlParts = fileUrl.split('/');
    const key = urlParts.slice(-2).join('/'); // Get the last two parts (products/filename)
    
    const command = new DeleteObjectCommand({
      Bucket: S3_CONFIG.bucketName,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Failed to delete file from S3');
  }
}