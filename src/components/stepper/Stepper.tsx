import React, { Fragment } from 'react';

import { BadgeCheck } from 'lucide-react';

import type { TSteps } from '@/types';

type Props = {
  steps: TSteps[];
  currentStep: number;
};

export const Stepper = ({ steps, currentStep }: Props) => {
  return (
    <aside className="mx-auto flex w-11/12 items-center justify-between font-bold text-gray-12 md:w-[500px]">
      {steps.map((step) => (
        <Fragment key={step.id}>
          <div className="flex items-center text-gray-12">
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
