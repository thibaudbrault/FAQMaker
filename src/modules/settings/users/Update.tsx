import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { AtSign } from 'lucide-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
import { useMediaQuery, useUpdateUser } from '@/hooks';
import { updateUserClientSchema } from '@/lib';

type Props = {
  user: User;
  tenantId: string;
};

type Schema = z.infer<typeof updateUserClientSchema>;

export const UpdateUser = ({ user, tenantId }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
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
            <DialogTitle className="font-serif text-2xl">
              Modify user
            </DialogTitle>
          </DialogHeader>
          <Form user={user} tenantId={tenantId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="primaryDark"
          weight="semibold"
          size="small"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Modify
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-stone-200/90">
        <div className="mb-10 mt-5">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-2xl">
              Modify user
            </DrawerTitle>
          </DrawerHeader>
          <Form user={user} tenantId={tenantId} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const Form = ({ user, tenantId }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<Schema>({
    resolver: zodResolver(updateUserClientSchema),
    mode: 'onBlur',
    defaultValues: {
      email: user.email,
      role: user.role,
    },
  });
  const { mutate, isError, error } = useUpdateUser(user.id, tenantId);

  const onSubmit: SubmitHandler<Schema> = (values) => {
    mutate(values);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty || !isValid);
  }, [isDirty, isSubmitting, isValid]);

  if (isError && error instanceof AxiosError) {
    const errorMessage = error.response?.data.message || 'An error occurred';
    errorToast(errorMessage);
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-4"
    >
      <fieldset className="mx-auto flex w-11/12 flex-col gap-2">
        <div className="flex flex-col gap-1 [&_svg]:focus-within:text-secondary">
          <Field label={'Email'} value={'email'} error={errors.email?.message}>
            <Input
              {...register('email', { required: true })}
              withIcon
              defaultValue={user.email}
              icon={<AtSign className="h-5 w-5" />}
              type="email"
              id="email"
              placeholder="Email"
              className="w-full rounded-md border border-transparent p-1 outline-none focus:border-secondary"
            />
          </Field>
        </div>
        {user.role !== 'tenant' && (
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
        )}
      </fieldset>
      <Button
        variant={disabled ? 'disabled' : 'primaryDark'}
        weight="semibold"
        className="lowercase"
        style={{ fontVariant: 'small-caps' }}
        disabled={disabled}
      >
        Update
      </Button>
    </form>
  );
};
