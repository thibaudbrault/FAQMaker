import { useMemo } from 'react';

import { Tenant } from '@prisma/client';
import { useForm } from 'react-hook-form';

import { Button, Input, Label, Loader } from '@/components';

type Props = {
  tenant: Tenant;
  isLoading: boolean;
};

export const Company = ({ tenant, isLoading }: Props) => {
  const { register, handleSubmit, reset } = useForm();

  const fields = useMemo(
    () => [
      {
        label: 'Company',
        value: 'company',
        type: 'text',
      },
      {
        label: 'Email',
        value: 'email',
        type: 'email',
      },
    ],
    [],
  );

  if (isLoading) {
    return <Loader size="items" />;
  }

  return (
    <div className="flex flex-col gap-4 w-3/4 mx-auto bg-stone-100 rounded-md p-4 mb-4">
      <h2
        className="text-4xl text-center font-serif font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Company
      </h2>
      <form className="flex flex-col items-center gap-4">
        <fieldset className="flex w-11/12 mx-auto gap-2">
          {fields.map((field) => (
            <div
              key={field.value}
              className="flex flex-1 flex-col gap-1 [&_svg]:focus-within:text-teal-700"
            >
              <Label
                htmlFor={field.value}
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                {field.label}
              </Label>
              <Input
                {...register(field.value, { required: true })}
                defaultValue={tenant[field.value]}
                type={field.type}
                id={field.value}
                placeholder={field.label}
                className="w-full border border-transparent outline-none rounded-md p-1 focus:border-teal-700"
              />
            </div>
          ))}
        </fieldset>
        <Button
          variant="primaryDark"
          weight="semibold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Update
        </Button>
      </form>
    </div>
  );
};
