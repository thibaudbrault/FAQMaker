export const nodeModel = {
  question: {
    select: {
      createdAt: true,
      updatedAt: true,
      id: true,
      text: true,
      slug: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  },
  answer: {
    select: {
      createdAt: true,
      updatedAt: true,
      id: true,
      text: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  },
  tags: true,
};
