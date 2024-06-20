import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Tag as TagIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { createTag, createTagSchema } from '@/actions';
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
} from '@/components';
import { useMediaQuery } from '@/hooks';

import type { $Enums } from '@prisma/client';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  tenantId: string;
  plan: $Enums.Plan;
  tagsCount: number;
};

type Schema = z.infer<typeof createTagSchema>;

const Form = ({ tenantId, plan, tagsCount }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(createTagSchema),
    mode: 'onBlur',
    defaultValues: {
      label: '',
      tagsCount,
      plan,
      tenantId,
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    await createTag(data);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isValid);
  }, [isSubmitting, isValid]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-2"
    >
      <fieldset className="mx-auto flex w-11/12 flex-col gap-1">
        <Field label="Label" value="label" error={errors.label?.message}>
          <Input
            {...register('label')}
            withIcon
            icon={<TagIcon />}
            type="label"
            id="label"
            placeholder="Tag label"
          />
        </Field>
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

export const CreateTag = ({ tenantId, plan, tagsCount }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="primary"
            icon="withIcon"
            font="large"
            size="full"
            weight="bold"
            className="lowercase"
            style={{ fontVariant: 'small-caps' }}
          >
            <PlusCircle />
            New tag
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New tag</DialogTitle>
          </DialogHeader>
          <Form tenantId={tenantId} plan={plan} tagsCount={tagsCount} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="primary"
          icon="withIcon"
          font="large"
          size="full"
          weight="bold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          <PlusCircle />
          New tag
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mb-10 mt-5">
          <DrawerHeader>
            <DrawerTitle>New tag</DrawerTitle>
          </DrawerHeader>
          <Form tenantId={tenantId} plan={plan} tagsCount={tagsCount} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
