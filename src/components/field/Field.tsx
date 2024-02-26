import { ReactNode } from 'react';

import { HelpCircle } from 'lucide-react';

import { Label } from '../label';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

type Props = {
  children: ReactNode;
  label: string;
  value: string;
  error?: string;
  info?: string;
};

export const Field = ({ children, label, value, error, info }: Props) => {
  return (
    <div
      key={value}
      className="flex flex-col gap-1 [&_svg]:focus-within:text-tealA-8"
    >
      <div className="flex items-center gap-1">
        <Label
          htmlFor={value}
          className={`lowercase ${error && 'text-red-9'}`}
          style={{ fontVariant: 'small-caps' }}
        >
          {label}
        </Label>
        {info && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{info}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {children}
      {error && <small className="text-xs text-red-9">{error}</small>}
    </div>
  );
};
