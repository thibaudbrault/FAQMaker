import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { AtSign } from 'lucide-react';
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
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      email: user.email,
      role: user.role,
    },
  });
  const { mutate, isLoading, isError, error } = useUpdateUser(
    user.id,
    tenantId,
  );

  const onSubmit = (values: ClientUser) => {
    mutate(values);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty);
  }, [isDirty, isSubmitting]);

  if (isError && error instanceof AxiosError) {
    const errorMessage = error.response?.data.message || 'An error occurred';
    errorToast(errorMessage);
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
          <fieldset className="mx-auto flex w-11/12 flex-col gap-2">
            <div className="flex flex-col gap-1 [&_svg]:focus-within:text-secondary">
              <Label
                htmlFor="email"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                Email
              </Label>
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
            </div>
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
