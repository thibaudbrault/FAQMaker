'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { TagIcon } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { deleteTag, updateTag, updateTagSchema } from '@/actions';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  resultToast,
} from '@/components';

import { CreateTag } from './Create';

import type { $Enums, Tag } from '@prisma/client';

type Props = {
  tenantId: string;
  plan: $Enums.Plan;
  tags: Tag[] | null;
  tagsCount: number;
};

type Schema = z.infer<typeof updateTagSchema>;

export const Tags = ({ tenantId, plan, tags, tagsCount }: Props) => {
  const [limit, setLimit] = useState<number>(3);
  const [disabled, setDisabled] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(updateTagSchema),
    mode: 'onBlur',
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const result = await updateTag(data);
    resultToast(result?.serverError, result?.data?.message);
  };

  const handleDeleteTag = async (id: string) => {
    const result = await deleteTag({ id, tenantId });
    resultToast(result?.serverError, result?.data?.message);
  };

  useEffect(() => {
    if (plan === 'startup') {
      setLimit(10);
    }
  }, [plan]);

  useEffect(() => {
    setDisabled(isSubmitting || !isValid || !isDirty);
  }, [isSubmitting, isValid, isDirty]);

  return (
    <section className="space-y-4">
      <h2
        className="text-xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Tags
      </h2>
      <div>
        {tags && tags.length > 0 ? (
          <ul className="my-6 flex list-none flex-wrap gap-4">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="flex w-fit items-center gap-2 rounded-md bg-gray-4 shadow-sm shadow-gray-6"
              >
                <Dialog>
                  <DialogTrigger>
                    <p className="px-2 font-semibold">{tag.label}</p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit the tag</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <Field label="name" value="label">
                        <input {...register('id')} value={tag.id} hidden />
                        <input
                          {...register('tenantId')}
                          value={tenantId}
                          hidden
                        />
                        <Input
                          {...register('label')}
                          defaultValue={tag.label}
                          withIcon
                          icon={<TagIcon />}
                          type="text"
                          placeholder={tag.label}
                        />
                      </Field>
                      <div className="space-y-2">
                        <Button
                          variant="primary"
                          type="submit"
                          size="full"
                          weight="semibold"
                          className="lowercase"
                          disabled={disabled}
                          style={{ fontVariant: 'small-caps' }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="destructive"
                          type="button"
                          size="full"
                          weight="semibold"
                          className="lowercase"
                          style={{ fontVariant: 'small-caps' }}
                          onClick={() => handleDeleteTag(tag.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        ) : (
          <p className="my-6 text-center italic">No tags</p>
        )}
        <CreateTag tenantId={tenantId} plan={plan} tagsCount={tagsCount} />
        {tags && tags.length > 0 && plan !== 'enterprise' && (
          <p className="mt-1 text-xs text-gray-11">
            Tags limit: <span className="font-semibold">{tags.length}</span> /{' '}
            <span className="font-semibold">{limit}</span>
          </p>
        )}
      </div>
    </section>
  );
};
