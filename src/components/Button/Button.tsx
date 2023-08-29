import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

const button = cva("button", {
  variants: {
    variant: {
      primaryDark: [
        "bg-teal-700",
        "text-stone-200",
        "border-transparent",
        "rounded-md",
        "hover:bg-teal-800",
      ],
      primaryLight: [
        "bg-stone-200",
        "text-teal-700",
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
        "text-teal-700",
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
        "text-teal-700",
        "border-transparent",
        "rounded-md",
      ],
    },
    icon: {
      withIcon: ["flex", "justify-center", "items-center", "gap-4"],
    },
    font: {
      small: ["text-sm"],
      base: ["text-base"],
      large: ["text-lg"],
    },
    weight: {
      bold: ["font-bold"],
      semibold: ["font-semibold"],
    },
    size: {
      small: ["py-1", "px-2"],
      medium: ["py-2", "px-4"],
      full: ["py-2 w-full"],
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
  ({ className, variant, icon, font, weight, size, ...props }, ref) => (
    <button
      className={cn(button({ variant, font, icon, weight, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";
