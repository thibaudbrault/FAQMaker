import { ReactNode, forwardRef } from 'react';

import { cn } from '@/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  withIcon?: boolean;
  icon?: ReactNode;
}

const styles =
  'dark:bg-negativeOffset w-full rounded-md border border-ghost dark:border-negativeGhost p-1 shadow-sm outline-none focus:border-accent dark:focus:border-accent';

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
