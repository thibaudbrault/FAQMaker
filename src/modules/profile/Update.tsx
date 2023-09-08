import { useMemo } from 'react';

import { Tenant } from '@prisma/client';
import { Label } from '@radix-ui/react-label';
import { AtSign, Lock, UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button, Input } from '@/components';
import { ClientUser } from '@/types';

type Props = {
  me: ClientUser & { tenant: Tenant };
};

export const UpdateProfile = ({ me }: Props) => {
  const { register, handleSubmit, reset } = useForm();

  const fields = useMemo(
    () => [
      {
        label: 'First Name',
        value: 'firstName',
        type: 'text',
        icon: <UserIcon className="w-5 h-5" />,
      },
      {
        label: 'Last Name',
        value: 'lastName',
        type: 'text',
        icon: <UserIcon className="w-5 h-5" />,
      },
      {
        label: 'Email',
        value: 'email',
        type: 'email',
        icon: <AtSign className="w-5 h-5" />,
      },
    ],
    [],
  );

  return (
    <>
      <h2
        className="text-4xl text-center font-serif font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Informations
      </h2>
      <form className="flex flex-col items-center gap-4">
        <fieldset className="flex flex-col w-11/12 mx-auto gap-2">
          {fields.map((field) => (
            <div
              key={field.value}
              className="flex flex-col gap-1 [&_svg]:focus-within:text-teal-700"
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
                defaultValue={me[field.value]}
                withIcon
                icon={field.icon}
                type={field.type}
                id={field.value}
                placeholder={field.label}
                className="w-full border border-transparent outline-none rounded-md p-1 focus:border-teal-700"
              />
            </div>
          ))}
          <div className="flex gap-2 w-full">
            <div className="flex flex-1 flex-col gap-1 [&_svg]:focus-within:text-teal-700">
              <Label
                htmlFor="password"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                Password
              </Label>
              <Input
                {...register('password', { required: true })}
                withIcon
                icon={<Lock />}
                type="password"
                id="password"
                placeholder="Password"
                className="w-full border border-transparent outline-none rounded-md p-1 focus:border-teal-700"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1 [&_svg]:focus-within:text-teal-700">
              <Label
                htmlFor="cpassword"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                Confirm Password
              </Label>
              <Input
                {...register('cpassword', { required: true })}
                withIcon
                icon={<Lock />}
                type="password"
                id="cpassword"
                placeholder="Confirm password"
                className="w-full border border-transparent outline-none rounded-md p-1 focus:border-teal-700"
              />
            </div>
          </div>
        </fieldset>
        <Button variant="primaryDark">Update</Button>
      </form>
    </>
  );
};
