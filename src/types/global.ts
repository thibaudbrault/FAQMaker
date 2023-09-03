import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export type FallbackType = 'screen' | 'page' | 'item';
export type QueryParamsType = Partial<{
  [key: string]: string | string[];
}>;
export type NextReq = IncomingMessage & {
  cookies: NextApiRequestCookies;
};
