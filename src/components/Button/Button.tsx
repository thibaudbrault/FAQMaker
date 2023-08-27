import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

const button = cva("button", {
  variants: {
    variant: {
      primaryDark: [
        "bg-stone-900",
        "text-stone-200",
        "border-transparent",
        "rounded-md",
        "hover:bg-stone-950",
      ],
      primaryLight: [
        "bg-stone-200",
        "text-stone-900",
        "border-transparent",
        "rounded-md",
        "hover:bg-stone-300",
      ],
      secondaryDark: [
        "bg-transparent",
        "text-stone-200",
        "border-transparent",
        "rounded-md",
      ],
      secondaryLigh: [
        "bg-transparent",
        "text-stone-900",
        "border-transparent",
        "rounded-md",
      ],
      disabledDark: [
        "bg-stone-600",
        "text-stone-200",
        "border-transparent",
        "rounded-md",
      ],
      disabledLight: [
        "bg-stone-500",
        "text-stone-900",
        "border-transparent",
        "rounded-md",
      ],
    },
    font: {
      small: ["text-sm"],
      base: ["text-base"],
      large: ["text-lg"],
    },
    size: {
      small: ["py-1", "px-2"],
      medium: ["py-2", "px-4"],
    },
  },
  defaultVariants: {
    font: "base",
    size: "medium",
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, font, size, ...props }, ref) => (
    <button
      className={cn(button({ variant, font, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";
