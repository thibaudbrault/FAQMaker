import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AtSign, PlusCircle } from 'lucide-react';
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
} from '@/components';
import { useCreateUser, useMediaQuery } from '@/hooks';
import { createUserClientSchema } from '@/lib';

type Props = {
  tenantId: string;
};

type Schema = z.infer<typeof createUserClientSchema>;

export const CreateUser = ({ tenantId }: Props) => {
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
          <Form tenantId={tenantId} />
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
          <Form tenantId={tenantId} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const Form = ({ tenantId }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(createUserClientSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      role: 'user',
    },
  });

  const { mutate } = useCreateUser(tenantId, reset);

  const onSubmit: SubmitHandler<Schema> = (values) => {
    mutate(values);
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
            icon={<AtSign className="h-5 w-5" />}
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
                <SelectTrigger
                  id="role"
                  className="bg-white focus:border-accent focus:ring-0 data-[state=open]:border-accent dark:bg-negativeOffset"
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-200 dark:bg-negativeOffset">
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
