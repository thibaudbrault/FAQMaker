import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { $Enums } from '@prisma/client';
import { PlusCircle, Tag as TagIcon } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { createTag } from '@/actions';
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
import { createTagClientSchema } from '@/lib';

type Props = {
  tenantId: string;
  plan: $Enums.Plan;
  tagsCount: number;
};

type Schema = z.infer<typeof createTagClientSchema>;

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

const Form = ({ tenantId, plan, tagsCount }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(createTagClientSchema),
    mode: 'onBlur',
    defaultValues: {
      label: '',
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append('tagsCount', String(tagsCount));
    formData.append('plan', plan);
    formData.append('tenantId', tenantId);
    await createTag(formData);
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
