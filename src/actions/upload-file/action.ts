'use server';

import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadFile(file: File, fileName: string) {
  const fileBuffer = (await file.arrayBuffer()) as Buffer;
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: fileName,
    Body: fileBuffer,
    ContentType: file.type,
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
}

export const submitImage = async (formData: FormData, field: string) => {
  const image = formData.get(field);
  if (typeof image !== 'object' || !image || image?.size === 0) {
    return '';
  }
  const asciiName = image.name.replace(/[^\x00-\x7F]/g, '').replace('', '_');
  const fileName = `${new Date().getTime()}-${asciiName}`;
  await uploadFile(image as File, fileName);
  const url = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${fileName}`;
  return url;
};
