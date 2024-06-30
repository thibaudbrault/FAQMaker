import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  withIcon?: boolean;
  icon?: ReactNode;
}

const styles =
  'shadow-sm shadow-grayA-7 focus:shadow-tealA-8 bg-gray-3 w-full rounded-md p-1 outline-none';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, withIcon = false, icon, ...props }, ref) => {
    return withIcon ? (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        <input
          type={type}
          ref={ref}
          className={cn(styles, '!pl-12', className)}
          {...props}
        />
      </div>
    ) : (
      <input
        type={type}
        ref={ref}
        className={cn(styles, className)}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
