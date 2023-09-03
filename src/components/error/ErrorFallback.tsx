import { cn } from '@/utils';
import { VariantProps, cva } from 'class-variance-authority';
import React, { HTMLAttributes, forwardRef } from 'react';

const errorVariants = cva('error', {
  variants: {
    fallbackType: {
      item: ['h-8', 'w-8'],
      page: ['h-16', 'w-16'],
      screen: ['h-24', 'w-24'],
    },
  },
});

export interface ErrorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorVariants> {
  resetErrorBoundary: () => void;
  error: Error;
}

export const ErrorFallback = forwardRef<HTMLDivElement, ErrorProps>(
  ({ fallbackType, resetErrorBoundary, error }, ref) => {
    return (
      <div className={cn(errorVariants({ fallbackType }))} ref={ref}>
        <h1>Something went wrong</h1>
        <div>
          <p>
            UI: <b>{fallbackType}</b>
          </p>
          <p>
            Message: <b>{error.message}</b>
          </p>
        </div>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    );
  },
);
