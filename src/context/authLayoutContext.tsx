'use client';

import { createContext, useContext, ReactNode } from 'react';

type AuthLayoutContextType = {
  hasBackground?: boolean;
  currentStep?: number;
  noStepper?: boolean;
};

const AuthLayoutContext = createContext<AuthLayoutContextType>({});

export const useAuthLayout = () => useContext(AuthLayoutContext);

type AuthLayoutProviderProps = AuthLayoutContextType & {
  children: ReactNode;
};

export const AuthLayoutProvider = ({
  children,
  hasBackground,
  currentStep,
  noStepper,
}: AuthLayoutProviderProps) => {
  return (
    <AuthLayoutContext.Provider
      value={{ hasBackground, currentStep, noStepper }}
    >
      {children}
    </AuthLayoutContext.Provider>
  );
};
