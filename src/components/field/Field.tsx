import { ReactNode } from 'react';

import { Label } from '../label';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

type Props = {
  children: ReactNode;
  label: string;
  value: string;
  error: string;
  info?: string;
};

export const Field = ({ children, label, value, error, info }: Props) => {
  return (
    <div
      key={value}
      className="flex flex-col gap-1 [&_svg]:focus-within:text-secondary"
    >
      <div className="flex items-center gap-1">
        <Label
          htmlFor={value}
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          {label}
        </Label>
        {info && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent className="border-none bg-default text-default">
              <p>{info}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {children}
      {error && <small className="text-sm text-red-700">{error}</small>}
    </div>
  );
};
