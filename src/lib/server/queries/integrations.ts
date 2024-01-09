import prisma from 'lib/prisma';

export const getIntegration = async (tenantId: string) => {
  const integrations = await prisma.integrations.findUnique({
    where: { tenantId },
  });

  if (!integrations) return null;

  return integrations;
};
