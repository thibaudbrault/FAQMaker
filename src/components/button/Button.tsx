import { ButtonHTMLAttributes, forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils';

const button = cva('transition-all duration-300', {
  variants: {
    variant: {
      primary: [
        'bg-teal-9 hover:bg-teal-10 text-white shadow-sm shadow-transparent',
      ],
      ghost: [
        'bg-gray-3 hover:bg-gray-4 shadow-sm shadow-grayA-8 text-gray-12',
      ],
      secondary: [
        'bg-transparent text-tealA-11 shadow shadow-sm shadow-tealA-7 hover:shadow-tealA-8',
      ],
      disabled: [
        'bg-teal-surfaceLight dark:bg-teal-surfaceDark shadow-sm text-tealA-11 shadow-tealA-7 hover:shadow-tealA-8',
      ],
      disabledDestructive: [
        'bg-red-surfaceLight dark:bg-red-surfaceDark shadow-sm text-redA-11 shadow-redA-7 hover:shadow-redA-8',
      ],
      destructive: [
        'bg-red-9 hover:bg-red-10 text-white shadow-sm shadow-transparent',
      ],
    },
    icon: {
      withIcon: ['flex justify-center items-center gap-1'],
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
      small: ['py-1 px-2 w-fit'],
      medium: ['py-2 px-4 w-fit'],
      full: ['py-2 w-full'],
      icon: ['h-6 w-6'],
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
