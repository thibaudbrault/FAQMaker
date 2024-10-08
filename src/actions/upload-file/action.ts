'use server';

import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

import { s3Client } from '@/lib';

export async function uploadFile(
  file: File,
  fileName: string,
  company: string,
) {
  const fileBuffer = (await file.arrayBuffer()) as Buffer;
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: `${company}/${fileName}`,
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
  //eslint-disable-next-line no-control-regex
  const asciiName = image.name.replace(/[^\x00-\x7F]/g, '').replace('', '_');
  const fileName = `${new Date().getTime()}-${asciiName}`;
  const company = formData.get('company') as string;
  await uploadFile(image as File, fileName, company);
  const url = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${company}/${fileName}`;
  return url;
};
