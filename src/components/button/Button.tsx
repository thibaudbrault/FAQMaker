import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils';

const button = cva('transition-all duration-300', {
  variants: {
    variant: {
      primary: [
        'bg-teal-9 text-white shadow-sm shadow-transparent hover:bg-teal-10',
      ],
      ghost: [
        'bg-gray-3 text-gray-12 shadow-sm shadow-grayA-8 hover:bg-gray-4',
      ],
      secondary: [
        'bg-transparent text-tealA-11 shadow-sm shadow-tealA-7 hover:shadow-tealA-8',
      ],
      disabled: [
        'bg-teal-surfaceLight text-tealA-11 shadow-sm shadow-tealA-7 hover:shadow-tealA-8 dark:bg-teal-surfaceDark',
      ],
      disabledDestructive: [
        'bg-red-surfaceLight text-redA-11 shadow-sm shadow-redA-7 hover:shadow-redA-8 dark:bg-red-surfaceDark',
      ],
      destructive: [
        'bg-red-9 text-white shadow-sm shadow-transparent hover:bg-red-10',
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
