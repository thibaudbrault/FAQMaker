import { useMemo } from 'react';

import { AtSign, UserIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  errorToast,
} from '@/components';
import { useUpdateUser } from '@/hooks';
import { ClientUser } from '@/types';

type Props = {
  user: ClientUser;
  tenantId: string;
};

export const UpdateUser = ({ user, tenantId }: Props) => {
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

  const { register, handleSubmit, control } = useForm();
  const { mutate, isLoading, isError, error } = useUpdateUser(
    user.id,
    tenantId,
  );

  const onSubmit = (values: ClientUser) => {
    mutate(values);
  };

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="primaryDark"
          weight="semibold"
          size="small"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Modify
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-stone-200/90">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Modify user</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4"
        >
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
                  withIcon
                  defaultValue={user[field.value]}
                  icon={field.icon}
                  type={field.type}
                  id={field.value}
                  placeholder={field.label}
                  className="w-full border border-transparent outline-none rounded-md p-1 focus:border-teal-700"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="role"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                Role
              </Label>
              <Controller
                control={control}
                name="role"
                rules={{ required: true }}
                render={({ field: { onChange } }) => (
                  <Select onValueChange={onChange} defaultValue={user.role}>
                    <SelectTrigger
                      id="role"
                      className="bg-white focus:border-teal-700 focus:ring-0 data-[state=open]:border-teal-700"
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-stone-200">
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </fieldset>
          <Button
            variant="primaryDark"
            weight="semibold"
            className="lowercase"
            disabled={isLoading}
            style={{ fontVariant: 'small-caps' }}
          >
            Update
          </Button>
        </form>
        <DialogFooter>
          <p className="text-xs">
            The password will be created automatically and sent to the email
            entered
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
