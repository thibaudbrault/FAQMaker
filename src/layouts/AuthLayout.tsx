import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: Props) => {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-lime-50 via-emerald-200 to-teal-700">
      <section className="flex min-h-screen w-full items-center justify-center">
        {children}
      </section>
    </main>
  );
};
