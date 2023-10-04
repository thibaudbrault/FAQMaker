import prisma from 'lib/prisma';

export const getTenant = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      color: {
        select: {
          primary: true,
          secondary: true,
        },
      },
    },
  });

  if (!tenant) return null;

  return tenant;
};
