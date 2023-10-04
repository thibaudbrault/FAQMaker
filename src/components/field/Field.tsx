import { ReactNode } from 'react';

import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

import { Label } from '../label';

type Props = {
  children: ReactNode;
  label: string;
  value: string;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
};

export const Field = ({ children, label, value, error }: Props) => {
  return (
    <div
      key={value}
      className="flex flex-col gap-1 [&_svg]:focus-within:text-teal-700"
    >
      <Label
        htmlFor={value}
        className="lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        {label}
      </Label>
      {children}
      {error && <small className="text-sm text-red-700">{error.message}</small>}
    </div>
  );
};
