import prisma from 'lib/prisma';

export const getTags = async (tenantId: string) => {
  const tags = await prisma.tag.findMany({
    where: { tenantId },
  });

  if (!tags) return null;

  return tags;
};
