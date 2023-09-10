import { useMemo } from 'react';

import { User } from '@prisma/client';
import { AtSign, PlusCircle, UserIcon } from 'lucide-react';
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
import { useCreateUser } from '@/hooks';

type Props = {
  tenantId: string;
};

export const CreateUser = ({ tenantId }: Props) => {
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

  const { register, handleSubmit, control, reset } = useForm();
  const { mutate, isLoading, isError, error } = useCreateUser(tenantId, reset);

  const onSubmit = (values: User) => {
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
          size="full"
          font="large"
          icon="withIcon"
          weight="bold"
        >
          <PlusCircle />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-stone-200/90">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">New user</DialogTitle>
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
                  <Select onValueChange={onChange} defaultValue="user">
                    <SelectTrigger className="bg-white focus:border-teal-700 focus:ring-0 data-[state=open]:border-teal-700">
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
          <Button variant={'primaryDark'} type="submit" disabled={isLoading}>
            Add
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
