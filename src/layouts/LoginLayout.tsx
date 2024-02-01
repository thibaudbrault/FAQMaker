import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const LoginLayout = ({ children }: Props) => {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-black via-teal-950 to-teal-700">
      <section className="flex min-h-screen w-full items-center justify-center">
        <div className="mx-auto flex w-11/12 flex-col items-center gap-8 rounded-md bg-default p-8 md:w-[500px]">
          {children}
        </div>
      </section>
    </main>
  );
};
