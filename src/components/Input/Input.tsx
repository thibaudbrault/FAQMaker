import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  withIcon?: boolean;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, withIcon = false, icon, ...props }, ref) => {
    return withIcon ? (
      <div className="relative">
        <span className="absolute top-1/2 transform -translate-y-1/2 left-3">
          {icon}
        </span>
        <input
          type={type}
          ref={ref}
          className={cn("pl-12", className)}
          {...props}
        />
      </div>
    ) : (
      <input type={type} ref={ref} className={className} {...props} />
    );
  }
);
Input.displayName = "Input";
