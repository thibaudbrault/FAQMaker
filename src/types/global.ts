import type { ReactElement } from 'react';

import type { IncomingMessage } from 'http';
import type { NextApiRequestCookies } from 'next/dist/server/api-utils';

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
  info?: string;
  limit?: number;
}

export interface IUserCreateFields extends IFields {
  value: 'email';
}

export interface IUserLoginFields extends IFields {
  value: 'email' | 'password';
}
export interface IUserUpdateFields extends IFields {
  value: 'name' | 'email';
}

export interface ITenantCreateFields extends IFields {
  value: 'company' | 'companyEmail';
}

export interface ITenantUpdateFields extends IFields {
  value: 'company' | 'email';
}

export interface IIntegrations extends IFields {
  value: 'slack';
}

export interface IPlan {
  label: 'Free' | 'Startup' | 'Enterprise';
  value: 'free' | 'startup' | 'enterprise';
  price: number;
  lookup_key: string;
  icon?: ReactElement;
  message: string;
  benefits: string[];
  drawbacks?: string[];
}

export type TSteps = {
  id: number;
  label: string;
};
