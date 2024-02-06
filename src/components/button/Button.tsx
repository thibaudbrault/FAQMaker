import { ButtonHTMLAttributes, forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils';

const button = cva('button', {
  variants: {
    variant: {
      primary: [
        'bg-negative',
        'border',
        'border-transparent',
        'text-negative',
        'hover:bg-negativeOffset',
        'dark:bg-default',
        'dark:text-default',
        'dark:hover:bg-offset',
      ],
      negative: [
        'bg-default',
        'text-default',
        'border',
        'border-default',
        'transition-all',
        'duration-300',
        'hover:bg-offset',
        'dark:bg-negative',
        'dark:text-negative',
        'dark:border-negative',
        'dark:hover:bg-negativeOffset',
      ],
      ghost: [
        'bg-transparent',
        'text-negative',
        'border',
        'border-transparent',
      ],
      secondary: ['bg-transparent', 'text-accent', 'border', 'border-accent'],
      disabled: [
        'bg-disabled',
        'text-negative',
        'border',
        'border-transparent',
      ],
    },
    border: {
      primary: ['border-accent'],
    },
    icon: {
      withIcon: ['flex', 'justify-center', 'items-center', 'gap-1'],
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
      small: ['py-1', 'px-2', 'w-fit'],
      medium: ['py-2', 'px-4', 'w-fit'],
      full: ['py-2', 'w-full'],
      icon: ['h-6', 'w-6'],
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
      border,
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
            border,
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
