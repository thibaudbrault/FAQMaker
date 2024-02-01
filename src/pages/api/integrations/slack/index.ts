import { IncomingWebhook } from '@slack/webhook';

import { dateOptions, timeOptions } from '@/utils';

import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { slackIntegrationServerSchema } from '@/lib';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, error: {message: `Form data not provided`} });
      }
      const token = await getToken({ req });
      if (token) {
        const result = slackIntegrationServerSchema.safeParse(req.body);
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { url, text } = result.data;
          const webhook = new IncomingWebhook(url);
          await webhook.send({
            text,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*${text}*`,
                },
              },
              {
                type: 'divider',
                block_id: 'divider1',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `Asked on ${new Date().toLocaleDateString(
                    undefined,
                    dateOptions,
                  )} at ${new Date().toLocaleTimeString(undefined, timeOptions)}`,
                },
              },
            ],
          });
          return res.status(200).json({success: true, message: 'Question created successfully' });
        }
      } else {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Not signed in' } });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: { message: 'Method not allowed' } });
  }
}
