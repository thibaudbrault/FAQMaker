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
  hasLimit?: boolean;
  limit?: number;
  curLength?: number;
};

export const Field = ({
  children,
  label,
  value,
  error,
  info,
  hasLimit,
  limit,
  curLength,
}: Props) => {
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
      <div className="grid grid-cols-2 gap-2">
        {error && (
          <small className="col-start-1 justify-self-start text-xs text-red-9">
            {error}
          </small>
        )}
        {hasLimit && (
          <small className="col-start-2 justify-self-end text-xs text-gray-11">
            {curLength} / {limit} characters
          </small>
        )}
      </div>
    </div>
  );
};
