import type { ReactNode } from 'react';

import { Stepper } from '@/components';
import { useAuthLayout } from '@/context';
import { ThemeToggle } from '@/modules';

import type { TSteps } from '@/types';

type Props = {
  children: ReactNode;
};

const steps: TSteps[] = [
  { id: 1, label: 'Company' },
  { id: 2, label: 'User' },
  { id: 3, label: 'Confirm' },
];

export default function Layout({ children }: Props) {
  const { hasBackground, currentStep, noStepper } = useAuthLayout();

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-gradient-to-br from-gray-2 via-teal-4 to-teal-6">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      {!noStepper && currentStep && (
        <Stepper currentStep={currentStep} steps={steps} />
      )}
      {hasBackground ? (
        <div className="mx-auto flex w-11/12 flex-col items-center gap-8 rounded-md bg-grayA-3 p-8 text-gray-12 shadow-sm shadow-tealA-7 hover:shadow-tealA-8 md:w-[500px]">
          {children}
        </div>
      ) : (
        children
      )}
    </main>
  );
}
