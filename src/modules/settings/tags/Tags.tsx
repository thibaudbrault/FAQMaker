'use client';

import { useEffect, useState } from 'react';

import { deleteTag } from '@/actions';
import { Button, resultToast } from '@/components';

import { CreateTag } from './Create';

import type { $Enums, Tag } from '@prisma/client';

type Props = {
  tenantId: string;
  plan: $Enums.Plan;
  tags: Tag[];
  tagsCount: number;
};

export const Tags = ({ tenantId, plan, tags, tagsCount }: Props) => {
  const [limit, setLimit] = useState<number>(3);

  const handleDeleteTag = async (id: string) => {
    const result = await deleteTag({ id, tenantId });
    resultToast(result?.serverError, result?.data?.message);
  };

  useEffect(() => {
    if (plan === 'startup') {
      setLimit(10);
    }
  }, [plan]);

  return (
    <section className="mx-auto w-11/12 md:w-3/4">
      {tags.length > 0 ? (
        <ul className="my-6 flex list-none flex-wrap gap-4">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="flex w-fit items-center gap-2 rounded-md bg-gray-12 text-gray-1"
            >
              <p className="px-2 font-semibold">{tag.label}</p>
              <Button
                variant="primary"
                size="small"
                font="small"
                weight="semibold"
                rounded="none"
                className="flex items-center rounded-r-md"
                onClick={() => handleDeleteTag(tag.id)}
              >
                X
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="my-6 text-center italic">No tags</p>
      )}
      <CreateTag tenantId={tenantId} plan={plan} tagsCount={tagsCount} />
      {tags.length > 0 && plan !== 'enterprise' && (
        <p className="mt-1 text-xs text-gray-11">
          Tags limit: <span className="font-semibold">{tags.length}</span> /{' '}
          <span className="font-semibold">{limit}</span>
        </p>
      )}
    </section>
  );
};
