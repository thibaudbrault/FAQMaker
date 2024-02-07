import { ReactNode, useEffect, useState } from 'react';

import { ThemeToggle } from '@/modules';

type Props = {
  children: ReactNode;
};

export const LoginLayout = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-black via-teal-950 to-teal-700">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex w-11/12 flex-col items-center gap-8 rounded-md bg-default p-8 dark:bg-negative dark:text-negative md:w-[500px]">
        {children}
      </div>
    </main>
  );
};
