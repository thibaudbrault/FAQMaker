import { Tenant, User } from '@prisma/client';

export type UserWithTenant = User & {
  tenant: Tenant;
};

export type RegisterInfo = {
  company: string;
  companyEmail: string;
  email: string;
  customerId?: string;
  plan: 'free' | 'business' | 'enterprise';
};
