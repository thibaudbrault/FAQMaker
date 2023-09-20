import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: Props) => {
  return (
    <main className="h-screen w-full bg-gradient-to-br from-lime-50 via-emerald-200 to-teal-700">
      <section className="flex justify-center absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-1/3">
        {children}
      </section>
    </main>
  );
};
