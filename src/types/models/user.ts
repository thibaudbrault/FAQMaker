import { Color, Tenant, User } from '@prisma/client';

type PartialTenant = Tenant & {
  color: Color;
  logo: string;
  company: string;
};

export type UserWithTenant = User & {
  tenant: PartialTenant;
};

export type RegisterInfo = {
  company: string;
  companyEmail: string;
  domain?: string | null;
  email: string;
  customerId?: string;
  plan: 'free' | 'startup' | 'enterprise';
};
