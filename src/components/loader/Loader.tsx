import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

import type { VariantProps } from 'class-variance-authority';

const loader = cva(
  'inline-block animate-spin rounded-full border-solid border-current !border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
  {
    variants: {
      size: {
        items: ['size-12'],
        page: ['size-24'],
        screen: ['size-32'],
      },
      border: {
        thick: ['border-4'],
        thin: ['border'],
      },
    },
    defaultVariants: {
      border: 'thick',
    },
  },
);
export interface LoaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loader> {}

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size, border, color, ...props }, ref) => {
    return size === 'items' ? (
      <div className="flex w-full items-center justify-center py-8">
        <div
          className={cn(loader({ size, border }), color, className)}
          {...props}
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    ) : (
      <div
        className="flex h-screen w-full items-center justify-center"
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
