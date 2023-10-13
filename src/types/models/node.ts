import { Answer, Node, Question, Tag, User } from '@prisma/client';

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
};
