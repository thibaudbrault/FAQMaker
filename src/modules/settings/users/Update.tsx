'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AtSign, UserIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { updateUser, updateUserSchema } from '@/actions';
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
} from '@/components';
import { useMediaQuery } from '@/hooks';

import type { User } from '@prisma/client';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  user: User;
  tenantId: string;
};

type Schema = z.infer<typeof updateUserSchema>;

const Form = ({ user, tenantId }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<Schema>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onBlur',
    defaultValues: {
      name: user.name ?? '',
      email: user.email,
      role: user.role,
      tenantId,
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    await updateUser(data);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty || !isValid);
  }, [isDirty, isSubmitting, isValid]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-4"
    >
      <fieldset className="mx-auto flex w-11/12 flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Field label="Name" value="name" error={errors.name?.message}>
            <Input
              {...register('name')}
              withIcon
              defaultValue={user.name ?? ''}
              icon={<UserIcon className="size-5" />}
              type="name"
              id="name"
              placeholder="Name"
            />
          </Field>
        </div>
        <div className="flex flex-col gap-1">
          <Field label="Email" value="email" error={errors.email?.message}>
            <Input
              {...register('email', { required: true })}
              withIcon
              defaultValue={user.email}
              icon={<AtSign className="size-5" />}
              type="email"
              id="email"
              placeholder="Email"
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
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user" className="pl-8">
                      User
                    </SelectItem>
                    <SelectItem value="admin" className="pl-8">
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}
      </fieldset>
      <Button variant="primary" disabled={disabled}>
        Update
      </Button>
    </form>
  );
};

export const UpdateUser = ({ user, tenantId }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary" size="small">
            Modify
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modify user</DialogTitle>
          </DialogHeader>
          <Form user={user} tenantId={tenantId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="primary" size="small">
          Modify
        </Button>
      </DrawerTrigger>
      <DrawerContent>
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
