import type { ReactNode } from 'react';

import { ThemeToggle } from '@/modules';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <main className="relative flex h-screen min-h-screen w-full flex-col items-center justify-center gap-8 bg-gradient-to-br from-gray-2 via-teal-4 to-teal-6">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <section className="mx-auto flex min-h-[500px] w-full max-w-3xl flex-col rounded-md border border-primary bg-primary p-16">
        {children}
      </section>
    </main>
  );
}
