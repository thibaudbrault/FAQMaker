import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils';

const badge = cva('text-xs font-semibold', {
  variants: {
    variant: {
      primary: ['bg-gray-12 text-center text-gray-1'],
      disabled: ['bg-gray-11 text-center text-gray-1'],
    },
    rounded: {
      full: ['rounded-full'],
    },
    size: {
      small: ['min-w-[40px] px-2'],
    },
  },
});
export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badge> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, rounded, size, ...props }, ref) => (
    <div
      className={cn(badge({ variant, rounded, size }), className)}
      ref={ref}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';
