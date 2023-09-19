import { IncomingMessage } from 'http';

import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { ReactElement } from 'react';

export type FallbackType = 'screen' | 'page' | 'item';
export type QueryParamsType = Partial<{
  [key: string]: string | string[];
}>;
export type NextReq = IncomingMessage & {
  cookies: NextApiRequestCookies;
};

interface IFields {
  label: string;
  type: string;
  icon?: ReactElement;
}

export interface IUserFields extends IFields {
  value: 'firstName' | 'lastName' | 'email';
}

export interface ITenantFields extends IFields {
  value: 'company' | 'email';
}
