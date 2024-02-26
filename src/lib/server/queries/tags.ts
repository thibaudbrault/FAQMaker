import prisma from 'lib/prisma';

export const getTags = async (tenantId: string) => {
  const tags = await prisma.tag.findMany({
    where: { tenantId },
  });

  if (!tags) return null;

  return tags;
};

export const getTagsCount = async (tenantId: string) => {
  const tags = await prisma.tag.count({
    where: { tenantId },
  });

  if (!tags) return 0;

  return tags;
};
