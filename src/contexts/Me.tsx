'use client';

import { ReactNode, createContext } from 'react';

import { User } from '@prisma/client';

import { useMe } from '@/hooks';

type ContextProps = {
  me: User | null;
};

const defaultValue: ContextProps = { me: null };
export const MeContext = createContext<ContextProps>(defaultValue);

type ProviderProps = {
  children: ReactNode;
};

export const MeProvider = ({ children }: ProviderProps) => {
  const { data } = useMe();
  const me = data ?? null;
  return <MeContext.Provider value={{ me }}>{children}</MeContext.Provider>;
};
