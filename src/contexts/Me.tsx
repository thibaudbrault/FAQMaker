import { ReactNode, createContext } from 'react';

import { useMe } from '@/hooks';
import { ClientUser } from '@/types';

type ContextProps = {
  me: ClientUser | null;
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
