import { cn } from '@/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const button = cva('button', {
  variants: {
    variant: {
      primaryDark: [
        'bg-teal-700',
        'text-stone-200',
        'border-transparent',
        'hover:bg-teal-800',
      ],
      primaryLight: [
        'bg-stone-200',
        'text-teal-700',
        'border-transparent',
        'hover:bg-stone-300',
      ],
      secondaryDark: [
        'bg-transparent',
        'text-teal-700',
        'border border-teal-700',
      ],
      secondaryLight: [
        'bg-transparent',
        'text-stone-200',
        'border border-teal-700',
      ],
      disabledDark: ['bg-stone-600', 'text-stone-200', 'border-transparent'],
      disabledLight: ['bg-stone-500', 'text-teal-700', 'border-transparent'],
    },
    icon: {
      withIcon: ['flex', 'justify-center', 'items-center', 'gap-4'],
    },
    font: {
      small: ['text-sm'],
      base: ['text-base'],
      large: ['text-lg'],
    },
    rounded: {
      base: ['rounded-md'],
      bottom: ['rounded-b-md'],
      full: ['rounded-full'],
    },
    weight: {
      bold: ['font-bold'],
      semibold: ['font-semibold'],
    },
    size: {
      small: ['py-1', 'px-2'],
      medium: ['py-2', 'px-4'],
      full: ['py-2 w-full'],
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
          button({ variant, font, icon, weight, rounded, size, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
