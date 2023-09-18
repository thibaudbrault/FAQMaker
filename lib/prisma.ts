import { ClientUser } from '@/types';
import { PrismaClient, User } from '@prisma/client';

let prisma: PrismaClient;

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
}

export default prisma;
export const exclude = <T, Key extends keyof T>(
  model: T,
  ...keys: Key[]
): Omit<T, Key> => {
  if (!model) throw new Error('Model arg is missing.');

  for (const key of keys) {
    delete model[key];
  }
  return model;
};

export const excludeFromUser = (user: User): ClientUser => {
  return exclude(user, 'password');
};

export const excludeFromArray = <T, Key extends keyof T>(
  models: T[],
  ...keys: Key[]
): Omit<T, Key>[] => {
  if (!models || models.length === 0) {
    throw new Error('Models array is missing or empty.');
  }

  const result: Omit<T, Key>[] = [];

  for (const model of models) {
    const excludedModel = exclude(model, ...keys);
    result.push(excludedModel);
  }

  return result;
};

export const excludeFromUserArray = (users: User[]): ClientUser[] => {
  return excludeFromArray(users, 'password');
};
