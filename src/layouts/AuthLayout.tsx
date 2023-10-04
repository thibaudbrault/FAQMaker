import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: Props) => {
  return (
    <main className="h-screen w-full bg-gradient-to-br from-lime-50 via-emerald-200 to-teal-700">
      <section className="absolute left-1/2 top-1/2 flex w-1/3 -translate-x-1/2 -translate-y-1/2 transform justify-center">
        {children}
      </section>
    </main>
  );
};
