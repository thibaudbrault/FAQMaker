import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";
import { forwardRef, HTMLAttributes } from "react";

const badge = cva("badge", {
  variants: {
    variant: {
      pill: ["bg-teal-700", "text-stone-200", "rounded-full"],
    },
    rounded: {
      full: ["rounded-full"],
    },
    size: {
      small: ["px-2"],
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
  )
);
