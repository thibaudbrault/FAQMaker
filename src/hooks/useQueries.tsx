import { getNodes, getTags, getUser, getUsers } from '@/data';
import { Answer, Node, Question, Tag, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export const useUser = (email: string) =>
  useQuery<User, Error>({
    queryKey: ['user', email],
    queryFn: () => getUser(email),
  });

export const useUsers = (tenantId: string) =>
  useQuery<User[], Error>({
    queryKey: ['users', tenantId],
    queryFn: () => getUsers(tenantId),
  });

type ExtendedNode = Node & {
  question: Question;
  answer: Answer;
  tags: Tag[];
};

export const useNodes = (tenantId: string) =>
  useQuery<ExtendedNode[], Error>({
    queryKey: ['nodes', tenantId],
    queryFn: () => getNodes(tenantId),
  });

export const useTags = (tenantId: string) =>
  useQuery<Tag[], Error>({
    queryKey: ['nodes', tenantId],
    queryFn: () => getTags(tenantId),
  });
