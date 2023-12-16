import axios from 'axios';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Form data not provided` });
      }
      const { url, text } = req.body;
      console.log('🚀 ~ file: index.ts:17 ~ body:', req.body);
      await axios.post(url, text);
      return res.status(200);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
