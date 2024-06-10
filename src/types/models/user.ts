import type { User } from '@prisma/client';

export type Me = User & {
  tenant: {
    logo: string;
    company: string;
  };
};

export type RegisterInfo = {
  company: string;
  companyEmail: string;
  domain?: string | null;
  email: string;
  customerId?: string;
  plan: 'free' | 'startup' | 'enterprise';
};
