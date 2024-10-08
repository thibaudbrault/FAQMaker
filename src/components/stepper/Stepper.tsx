import { Fragment } from 'react';

import { BadgeCheck } from 'lucide-react';

import type { TSteps } from '@/types';

type Props = {
  currentStep: number;
};

export const Stepper = ({ currentStep }: Props) => {
  const steps: TSteps[] = [
    { id: 1, label: 'Company' },
    { id: 2, label: 'User' },
    { id: 3, label: 'Confirm' },
  ];

  return (
    <aside className="mx-auto flex w-11/12 items-center justify-between font-bold text-primary md:w-[500px]">
      {steps.map((step) => (
        <Fragment key={step.id}>
          <div className="flex items-center text-primary">
            {step.id < currentStep ? (
              <p className="flex items-center gap-1">
                <BadgeCheck className="size-full" aria-hidden="true" />
                {step.label}
              </p>
            ) : (
              <p className="mr-4 flex items-center">{step.label}</p>
            )}
          </div>
          <span className={`${step.id === steps.length ? 'hidden' : 'inline'}`}>
            /
          </span>
        </Fragment>
      ))}
    </aside>
  );
};
