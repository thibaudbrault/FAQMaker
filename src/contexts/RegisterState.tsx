import { createContext, useContext, useState } from 'react';

export const RegisterStateContext = createContext({});

export function RegisterProvider({ children }) {
  const value = useState({});
  return (
    <RegisterStateContext.Provider value={value}>
      {children}
    </RegisterStateContext.Provider>
  );
}

export function useRegisterState() {
  const context = useContext(RegisterStateContext);
  if (!context) {
    throw new Error(
      'useRegisterState must be used within the RegisterProvider',
    );
  }
  return context;
}
