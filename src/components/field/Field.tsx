import type { ReactNode } from 'react';

import { HelpCircle } from 'lucide-react';

import { Label } from '../label';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

type Props = {
  children: ReactNode;
  label: string;
  value: string;
  error?: string;
  info?: string;
  limit?: number;
  curLength?: number;
};

export const Field = ({
  children,
  label,
  value,
  error,
  info,
  limit,
  curLength,
}: Props) => {
  return (
    <div
      key={value}
      className="flex flex-col gap-2 [&_svg]:focus-within:text-teal-10"
    >
      <div className="flex items-center gap-1">
        <Label
          htmlFor={value}
          className={`text-sm font-medium capitalize ${error && 'text-red-9'}`}
        >
          {label}
        </Label>
        {info && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="size-3" />
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
        {limit && (
          <small
            className={`col-start-2 justify-self-end text-xs ${curLength > limit ? 'text-red-10' : 'text-gray-11'}`}
          >
            {curLength} / {limit} characters
          </small>
        )}
      </div>
    </div>
  );
};
