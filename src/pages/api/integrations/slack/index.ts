import { IncomingWebhook } from '@slack/webhook';

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
      const webhook = new IncomingWebhook(url);
      await webhook.send({
        text,
      });
      return res.status(200).json({ message: 'Question created successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
