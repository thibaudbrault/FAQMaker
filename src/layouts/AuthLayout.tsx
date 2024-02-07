import { ReactNode, useEffect, useState } from 'react';

import { Stepper } from '@/components';
import { ThemeToggle } from '@/modules';
import { TSteps } from '@/types';

type Props = {
  children: ReactNode;
  hasBackground?: boolean;
  currentStep?: number;
  noStepper?: boolean;
};

const steps: TSteps[] = [
  { id: 1, label: 'Company' },
  { id: 2, label: 'User' },
  { id: 3, label: 'Confirm' },
];

export const AuthLayout = ({
  children,
  hasBackground,
  currentStep,
  noStepper,
}: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-gradient-to-br from-black via-teal-950 to-teal-700">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      {!noStepper && <Stepper currentStep={currentStep} steps={steps} />}
      {hasBackground ? (
        <div className="mx-auto flex w-11/12 flex-col items-center gap-8 rounded-md bg-default p-8 dark:bg-negative md:w-[500px]">
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
    </main>
  );
};
