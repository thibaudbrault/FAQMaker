import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils';

const button = cva('transition-all duration-300', {
  variants: {
    variant: {
      primary: [
        'bg-gray-12 text-gray-1 shadow-sm shadow-transparent disabled:bg-gray-10 disabled:text-gray-12 disabled:shadow-sm disabled:shadow-grayA-7 disabled:hover:shadow-grayA-8 disabled:dark:bg-gray-surfaceDark',
      ],
      ghost: [
        'bg-gray-3 text-gray-12 shadow-sm shadow-grayA-8 hover:bg-gray-4 disabled:shadow-transparent disabled:bg-transparent',
      ],
      secondary: [
        'bg-transparent text-tealA-11 shadow-sm shadow-tealA-7 hover:shadow-tealA-8',
      ],
      destructive: [
        'bg-destructive text-white shadow-sm shadow-transparent hover:bg-destructive-hover disabled:bg-destructive-disabled disabled:text-redA-11 disabled:shadow-sm disabled:shadow-redA-7 disabled:hover:shadow-redA-8 disabled:dark:bg-destructive-disabled-dark',
      ],
    },
    icon: {
      withIcon: ['flex items-center justify-center gap-1'],
    },
    font: {
      small: ['text-sm'],
      base: ['text-base'],
      large: ['text-lg'],
    },
    rounded: {
      none: ['rounded-none'],
      base: ['rounded-md'],
      bottom: ['rounded-b-md'],
      full: ['rounded-full'],
    },
    weight: {
      bold: ['font-bold'],
      semibold: ['font-semibold'],
    },
    size: {
      small: ['w-fit px-2 py-1'],
      medium: ['w-fit px-4 py-2'],
      full: ['w-full py-2'],
      icon: ['size-6'],
    },
  },
  defaultVariants: {
    font: 'base',
    rounded: 'base',
    size: 'medium',
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
