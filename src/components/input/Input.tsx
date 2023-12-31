import { ReactNode, forwardRef } from 'react';

import { cn } from '@/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  withIcon?: boolean;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, withIcon = false, icon, ...props }, ref) => {
    return withIcon ? (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 transform">
          {icon}
        </span>
        <input
          type={type}
          ref={ref}
          className={cn('!pl-12 shadow-sm', className)}
          {...props}
        />
      </div>
    ) : (
      <input
        type={type}
        ref={ref}
        className={cn('shadow-sm', className)}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
