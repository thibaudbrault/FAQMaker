import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  hasBackground?: boolean;
};

export const AuthLayout = ({ children, hasBackground }: Props) => {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-black via-teal-950 to-teal-700">
      <section className="flex min-h-screen w-full items-center justify-center">
        {hasBackground ? (
          <div className="flex min-w-[500px] flex-col items-center gap-8 rounded-md bg-stone-100 p-8">
            {children}
          </div>
        ) : (
          <>{children}</>
        )}
      </section>
    </main>
  );
};
