import { Color, Tenant, User } from '@prisma/client';

type TenantWithColor = Tenant & {
  color: Color;
};

export type UserWithTenant = User & {
  tenant: TenantWithColor;
};

export type RegisterInfo = {
  company: string;
  companyEmail: string;
  domain?: string | null;
  email: string;
  customerId?: string;
  plan: 'free' | 'startup' | 'enterprise';
};
