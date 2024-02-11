import { Storage } from '@google-cloud/storage';
import { Fields, Files, IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export const config = {
  api: {
    bodyParser: false,
  },
};

const bucketName = 'faqmaker';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = await getToken({ req });
  if (req.method === 'POST') {
    try {
      if (token) {
        const data = await new Promise<{
          fields: Fields;
          files: Files;
        }>((resolve, reject) => {
          const form = new IncomingForm();
          form.parse(req, (error, fields, files) => {
            if (error) return reject(error);
            resolve({ fields, files });
          });
        });
        const logo = data.files.logo?.[0];
        if (!logo) {
          return res
            .status(500)
            .json({ success: false, error: { message: 'Logo not found' } });
        }
        const storage = new Storage({
          projectId: process.env.PROJECT_ID,
          keyFilename: 'gcpKeyFile.json',
        });
        const bucket = storage.bucket(bucketName);
        const options = {
          destination: `logos/${logo.newFilename}${logo.originalFilename}`,
          public: true,
        };
        bucket.upload(logo.filepath, options, (error, file) => {
          console.log('error: ', error);
          console.log('file: ', file);
        });
      } else {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Not signed in' } });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message });
      }
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: { message: 'Method not allowed' } });
  }
}
