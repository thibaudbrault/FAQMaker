import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/utils';

export interface PasswordProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  lockIcon?: ReactNode;
  unlockIcon?: ReactNode;
}

const styles =
  'shadow-sm shadow-grayA-7 focus:shadow-tealA-8 bg-gray-3 w-full rounded-md p-1 outline-none';

export const Password = forwardRef<HTMLInputElement, PasswordProps>(
  ({ className, type, lockIcon, ...props }, ref) => {
    return (
      <div className="flex items-center gap-4">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            {lockIcon}
          </span>
          <input
            type={type}
            ref={ref}
            className={cn(styles, '!pl-12', className)}
            {...props}
          />
        </div>
        <button>See</button>
      </div>
    );
  },
);
Password.displayName = 'Password';
