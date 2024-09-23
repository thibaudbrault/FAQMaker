import type { ReactNode } from 'react';

import { ThemeToggle } from '@/modules';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-2 via-teal-4 to-teal-6">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex w-11/12 flex-col items-center gap-8 rounded-md bg-primary-foreground-alpha p-8 text-primary shadow-sm shadow-tealA-7 hover:shadow-tealA-8 md:w-[500px]">
        {children}
      </div>
    </main>
  );
}
