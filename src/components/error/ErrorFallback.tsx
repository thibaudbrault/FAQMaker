import React, { HTMLAttributes, forwardRef } from 'react';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils';

import { Button } from '../button';

const errorVariants = cva('error', {
  variants: {
    fallbackType: {
      item: ['h-8', 'w-8'],
      page: ['h-16', 'w-16'],
      screen: ['h-screen', 'w-screen'],
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
      <div
        className={cn(
          errorVariants({ fallbackType }),
          'flex flex-col items-center justify-center gap-2 bg-negative text-negative',
        )}
        ref={ref}
      >
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <div>
          <p>
            UI: <b>{fallbackType}</b>
          </p>
          <p>
            Message: <b>{error.message}</b>
          </p>
        </div>
        <Button
          variant="ghost"
          font="large"
          size="small"
          weight="semibold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          onClick={resetErrorBoundary}
        >
          Try again
        </Button>
      </div>
    );
  },
);
ErrorFallback.displayName = 'ErrorFallback';
