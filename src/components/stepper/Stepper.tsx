import React from 'react';

import { BadgeCheck } from 'lucide-react';

import { TSteps } from '@/types';

type Props = {
  steps: TSteps[];
  currentStep: number;
};

export const Stepper = ({ steps, currentStep }: Props) => {
  return (
    <aside className="mx-auto flex w-11/12 items-center justify-between font-bold text-negative md:w-[500px]">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`flex items-center text-negative ${
            step.id === steps.length ? 'after:hidden' : 'after:inline-block'
          } after:ml-8 after:w-full after:content-['/']`}
        >
          {step.id < currentStep ? (
            <span className="flex items-center">
              <BadgeCheck
                className="me-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4"
                aria-hidden="true"
              />
              {step.label}
            </span>
          ) : (
            <span className="flex items-center">{step.label}</span>
          )}
        </div>
      ))}
    </aside>
  );
};
