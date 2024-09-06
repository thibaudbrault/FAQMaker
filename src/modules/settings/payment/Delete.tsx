'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Flame } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { deleteTenant, deleteTenantSchema } from '@/actions';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@/components';

import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  tenantId: string;
  company: string;
};
type Schema = z.infer<typeof deleteTenantSchema>;

export const Delete = ({ tenantId, company }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(deleteTenantSchema),
    mode: 'onBlur',
    defaultValues: {
      text: '',
      id: tenantId,
      company,
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    await deleteTenant(data);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isValid);
  }, [isSubmitting, isValid]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          weight="semibold"
          className="lowercase"
          icon="withIcon"
          style={{ fontVariant: 'small-caps' }}
        >
          <Flame />
          Delete account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete your account ? <br /> Deleting your
          account is permanent and will delete all your data forever.
        </p>

        <p className="text-sm text-gray-11">
          Type <span className="font-semibold">DELETE {company}</span> to
          confirm
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input {...register('text', { required: true })} />
          <DialogFooter className="justify-end gap-2">
            <DialogClose asChild>
              <Button
                variant="ghost"
                weight="semibold"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
                type="button"
                onClick={() => setValue('text', '')}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant={disabled ? 'disabledDestructive' : 'destructive'}
              weight="semibold"
              className="lowercase"
              style={{ fontVariant: 'small-caps' }}
              type="submit"
              disabled={disabled}
            >
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
