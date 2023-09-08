import { HTMLAttributes, forwardRef } from 'react';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils';

const loader = cva(
  [
    'inline-block animate-spin rounded-full border-4 border-solid border-current !border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
  ],
  {
    variants: {
      size: {
        items: ['h-8', 'w-8'],
        page: ['h-16', 'w-16'],
        screen: ['h-24', 'w-24'],
      },
    },
  },
);

export interface LoaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loader> {}

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size, color, ...props }, ref) => {
    return (
      <div
        className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
        ref={ref}
      >
        <div
          className={cn(loader({ size }), color, className)}
          {...props}
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  },
);
Loader.displayName = 'Loader';
