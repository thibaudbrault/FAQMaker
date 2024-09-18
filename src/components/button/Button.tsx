import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils';

const button = cva('transition-all duration-300 ease-in-out lowercase', {
  variants: {
    variant: {
      primary:
        'bg-primary-negative text-primary-negative shadow-sm shadow-transparent disabled:bg-primary-negative-disabled disabled:text-primary disabled:shadow-sm disabled:shadow-grayA-7 disabled:hover:shadow-grayA-8',
      ghost:
        'bg-primary-foreground text-primary shadow-sm shadow-grayA-7 hover:bg-primary-foreground-hover disabled:shadow-transparent disabled:bg-transparent',

      secondary:
        'bg-transparent text-tealA-11 shadow-sm shadow-tealA-7 hover:shadow-tealA-8',

      destructive:
        'bg-destructive text-white shadow-sm shadow-transparent hover:bg-destructive-hover disabled:bg-destructive-disabled disabled:text-redA-11 disabled:shadow-sm disabled:shadow-redA-7 disabled:hover:shadow-redA-8 disabled:dark:bg-destructive-disabled-dark',
    },
    icon: {
      true: 'flex items-center justify-center gap-1',
    },
    font: {
      small: 'text-sm',
      base: 'text-base',
      large: 'text-lg',
    },
    rounded: {
      none: 'rounded-none',
      base: 'rounded-md',
      bottom: 'rounded-b-md',
      full: 'rounded-full',
    },
    weight: {
      bold: 'font-bold',
      semibold: 'font-semibold',
    },
    size: {
      small: 'w-fit px-2 py-1',
      medium: 'w-fit px-4 py-2',
      full: 'w-full py-2',
      icon: 'size-6',
    },
  },
  defaultVariants: {
    font: 'base',
    rounded: 'base',
    size: 'medium',
    weight: 'semibold',
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      asChild = false,
      variant,
      icon,
      font,
      rounded,
      weight,
      size,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        style={{ fontVariant: 'small-caps' }}
        className={cn(
          button({
            variant,
            font,
            icon,
            weight,
            rounded,
            size,
            className,
          }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
