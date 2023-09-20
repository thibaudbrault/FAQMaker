import { useEffect, useMemo, useState } from 'react';

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
  Field,
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
  const [disabled, setDisabled] = useState<boolean>(true);
  const fields = useMemo(
    () => [
      {
        label: 'First Name',
        value: 'firstName',
        type: 'text',
        icon: <UserIcon className="h-5 w-5" />,
        error: 'First name is required',
      },
      {
        label: 'Last Name',
        value: 'lastName',
        type: 'text',
        icon: <UserIcon className="h-5 w-5" />,
        error: 'Last name is required',
      },
      {
        label: 'Email',
        value: 'email',
        type: 'email',
        icon: <AtSign className="h-5 w-5" />,
        error: 'Email is required',
      },
    ],
    [],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm();

  const { mutate, isError, error } = useCreateUser(tenantId, reset);

  const onSubmit = (values: User) => {
    mutate(values);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isValid);
  }, [isSubmitting, isValid]);

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
          weight="semibold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          <PlusCircle />
          New user
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
          <fieldset className="mx-auto flex w-11/12 flex-col gap-2">
            {fields.map((field) => (
              <Field
                key={field.value}
                label={field.label}
                value={field.value}
                error={errors?.[field.error]}
              >
                <Input
                  {...register(field.value, { required: field.error })}
                  withIcon
                  icon={field.icon}
                  type={field.type}
                  id={field.value}
                  placeholder={field.label}
                  className="w-full rounded-md border border-transparent p-1 outline-none focus:border-teal-700"
                />
              </Field>
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
                  <Select onValueChange={onChange}>
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
            variant={disabled ? 'disabledDark' : 'primaryDark'}
            weight="semibold"
            className="lowercase"
            style={{ fontVariant: 'small-caps' }}
            disabled={disabled}
          >
            Add
          </Button>
        </form>
        <DialogFooter className="w-full">
          <p className="w-full text-center text-xs">
            A secured password will be created and sent to the email entered
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
