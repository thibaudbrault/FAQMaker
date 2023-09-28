import { IncomingMessage } from 'http';

import { ReactElement } from 'react';

import { NextApiRequestCookies } from 'next/dist/server/api-utils';

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
  error?: string;
}

export interface IUserFields extends IFields {
  value: 'name' | 'email';
}

export interface ITenantFields extends IFields {
  value: 'company' | 'email';
}
