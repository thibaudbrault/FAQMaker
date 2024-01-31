import { ReactNode } from 'react';

import { Stepper } from '@/components';
import { TSteps } from '@/types';

type Props = {
  children: ReactNode;
  hasBackground?: boolean;
  currentStep: number;
};

const steps: TSteps[] = [
  { id: 1, label: 'Company' },
  { id: 2, label: 'User' },
  { id: 3, label: 'Confirm' },
  { id: 4, label: 'Plan' },
];

export const AuthLayout = ({ children, hasBackground, currentStep }: Props) => {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-black via-teal-950 to-teal-700">
      <section className="flex min-h-screen w-full flex-col items-center justify-center gap-8">
        <Stepper currentStep={currentStep} steps={steps} />
        {hasBackground ? (
          <div className="mx-auto flex w-11/12 flex-col items-center gap-8 rounded-md bg-default p-8 md:w-[500px]">
            {children}
          </div>
        ) : (
          <>{children}</>
        )}
      </section>
    </main>
  );
};
