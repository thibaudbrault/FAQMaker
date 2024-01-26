import prisma from 'lib/prisma';

export const getTenant = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      color: {
        select: {
          foreground: true,
          background: true,
          border: true,
        },
      },
    },
  });

  if (!tenant) return null;

  return tenant;
};
