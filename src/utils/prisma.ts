export const nodeModel = {
  question: {
    select: {
      id: true,
      text: true,
      slug: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
  answer: {
    select: {
      text: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
  tags: {
    select: {
      label: true,
    },
  },
};
