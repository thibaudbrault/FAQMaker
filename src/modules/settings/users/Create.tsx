import { useEffect, useState } from 'react';

import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { AtSign, PlusCircle } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import {
  Button,
  Dialog,
  DialogContent,
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
import { IUserCreateFields } from '@/types';

type Props = {
  tenantId: string;
};

type FormData = {
  email: string;
  role: string;
};

export const CreateUser = ({ tenantId }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const field: IUserCreateFields = {
    label: 'Email',
    value: 'email',
    type: 'email',
    icon: <AtSign className="h-5 w-5" />,
    error: 'Email is required',
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>();

  const { mutate, isError, error } = useCreateUser(tenantId, reset);

  const onSubmit = (values: User) => {
    mutate(values);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isValid);
  }, [isSubmitting, isValid]);

  if (isError && error instanceof AxiosError) {
    const errorMessage = error.response?.data.message || 'An error occurred';
    errorToast(errorMessage);
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
            <Field
              key={field.value}
              label={field.label}
              value={field.value}
              error={errors?.[field.error].message}
            >
              <Input
                {...register(field.value, { required: field.error })}
                withIcon
                icon={field.icon}
                type={field.type}
                id={field.value}
                placeholder={field.label}
                className="w-full rounded-md border border-transparent p-1 outline-none focus:border-secondary"
              />
            </Field>
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
                      className="bg-white focus:border-secondary focus:ring-0 data-[state=open]:border-secondary"
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
            variant={disabled ? 'disabled' : 'primaryDark'}
            weight="semibold"
            className="lowercase"
            style={{ fontVariant: 'small-caps' }}
            disabled={disabled}
          >
            Add
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
