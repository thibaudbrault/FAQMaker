import React from 'react';

import { BadgeCheck } from 'lucide-react';

import { TSteps } from '@/types';

type Props = {
  steps: TSteps[];
  currentStep: number;
};

export const Stepper = ({ steps, currentStep }: Props) => {
  return (
    <aside className="mx-auto flex w-11/12 items-center justify-between text-negative md:w-[500px] font-bold">
      {steps.map(step => (
        <div key={step.id} className={`flex items-center text-negative ${step.id === steps.length ? 'after:hidden' : 'after:inline-block'} after:content-['/'] after:w-full after:ml-8`}>
            {step.id < currentStep ? (
                <span className="flex items-center">
                    <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" />
                    {step.label}
                </span>
            ) : (
                <span className="flex items-center">
                    {step.label}
                </span>
            )}
        </div>
      ))}
    </aside>
  );
};
