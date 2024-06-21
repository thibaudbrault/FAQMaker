'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AtSign, PlusCircle } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { createUser, createUserSchema } from '@/actions';
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
  resultToast,
} from '@/components';
import { useMediaQuery } from '@/hooks';

import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  tenantId: string;
  usersCount: number;
};

type Schema = z.infer<typeof createUserSchema>;

const Form = ({ tenantId, usersCount }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(createUserSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      role: 'user',
      tenantId,
      usersCount,
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const result = await createUser(data);
    resultToast(result?.serverError, result?.data?.message);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isValid);
  }, [isSubmitting, isValid]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-4"
    >
      <fieldset className="mx-auto flex w-11/12 flex-col gap-2">
        <Field label="Email" value="email" error={errors.email?.message}>
          <Input
            {...register('email')}
            withIcon
            icon={<AtSign className="size-5" />}
            type="email"
            id="email"
            placeholder="Email"
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
              <Select defaultValue="user" onValueChange={onChange}>
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
      </fieldset>
      <Button
        variant={disabled ? 'disabled' : 'primary'}
        weight="semibold"
        className="lowercase"
        style={{ fontVariant: 'small-caps' }}
        disabled={disabled}
      >
        Add
      </Button>
    </form>
  );
};

export const CreateUser = ({ tenantId, usersCount }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="primary"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New user</DialogTitle>
          </DialogHeader>
          <Form tenantId={tenantId} usersCount={usersCount} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="primary"
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
      </DrawerTrigger>
      <DrawerContent>
        <div className="mb-10 mt-5">
          <DrawerHeader>
            <DrawerTitle className="text-2xl">New user</DrawerTitle>
          </DrawerHeader>
          <Form tenantId={tenantId} usersCount={usersCount} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
