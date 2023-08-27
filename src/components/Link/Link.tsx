import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import NextLink, { LinkProps } from "next/link";
import { forwardRef, ReactNode } from "react";

const link = cva("link", {
  variants: {
    intent: {
      primary: ["cursor-pointer"],
      secondary: [
        "bg-white",
        "text-gray-800",
        "border-gray-400",
        "hover:bg-gray-100",
      ],
    },
    decoration: {
      underline: ["hover:underline"],
      none: ["hover:no-underline"],
    },
  },
  defaultVariants: {
    intent: "primary",
    decoration: "none",
  },
});

export interface AnchorProps extends LinkProps, VariantProps<typeof link> {
  className?: string;
  children: ReactNode;
}

export const Link = forwardRef<LinkProps, AnchorProps>(
  ({ className, intent, decoration, ...props }, ref) => (
    <NextLink
      className={cn(link({ intent, decoration, className }))}
      ref={ref}
      {...props}
    />
  )
);
Link.displayName = "Link";
