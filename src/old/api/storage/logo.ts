import { Storage } from '@google-cloud/storage';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const bucketName = 'faqmaker';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = await getToken({ req });
  if (req.method === 'POST') {
    try {
      if (token) {
        const storage = new Storage({
          projectId: process.env.PROJECT_ID,
          credentials: {
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
        });
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(`logos/${req.query.file as string}`);
        const options = {
          expires: Date.now() + 1 * 60 * 1000, //  1 minute,
          fields: { 'x-goog-meta-test': 'data' },
        };
        const [response] = await file.generateSignedPostPolicyV4(options);
        res.status(200).json(response);
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
