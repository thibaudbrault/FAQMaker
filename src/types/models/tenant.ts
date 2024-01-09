import { Color, Tenant } from '@prisma/client';

export type ExtendedTenant = Tenant & {
  color: Color;
};
