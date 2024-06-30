import type {
  Answer,
  Favorite,
  Node,
  Question,
  Reaction,
  Tag,
  User,
} from '@prisma/client';

type ExtendedQuestion = Question & {
  user: User;
};

type ExtendedAnswer = Answer & {
  user: User;
};

export type ExtendedNode = Node & {
  question: ExtendedQuestion;
  answer: ExtendedAnswer;
  tags: Tag[];
  reactions: Reaction[];
};

export type NodeWithQuestionAndAnswer = Node & {
  answer: {
    text: string;
  };
  question: {
    id: string;
    slug: string;
    text: string;
  };
};

export type QuestionWithNodeId = Question & {
  node: {
    id: string;
  };
};

export type ExtendedFavorites = Favorite & {
  node: Node & {
    question: Question;
  };
};
