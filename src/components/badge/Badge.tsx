import { forwardRef, HTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils';

const badge = cva('text-xs font-semibold', {
  variants: {
    variant: {
      primary: ['bg-gray-12 text-gray-1 text-center'],
      disabled: ['bg-gray-11 text-gray-1 text-center'],
    },
    rounded: {
      full: ['rounded-full'],
    },
    size: {
      small: ['px-2 min-w-[40px]'],
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
