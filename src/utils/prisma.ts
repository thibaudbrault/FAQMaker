export const nodeModel = {
  question: {
    select: {
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

export const nodeModelWithDate = {
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
