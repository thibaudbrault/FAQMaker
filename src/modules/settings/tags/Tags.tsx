import { useEffect, useState } from 'react';

import { $Enums } from '@prisma/client';

import { Button, Loader } from '@/components';
import { useDeleteTag, useTags } from '@/hooks';

import { CreateTag } from './Create';

type Props = {
  tenantId: string;
  plan: $Enums.Plan;
};

export const Tags = ({ tenantId, plan }: Props) => {
  const [limit, setLimit] = useState<number>(3);

  const { data: tags, isPending } = useTags(tenantId);
  const { mutate, isPending: isTagLoading } = useDeleteTag(tenantId);

  const handleDeleteTag = (id: string) => {
    mutate({ id });
  };

  useEffect(() => {
    if (plan === 'startup') {
      setLimit(10);
    }
  }, [plan]);

  if (isPending || isTagLoading) {
    return <Loader size="screen" />;
  }

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
      <CreateTag tenantId={tenantId} />
      {tags.length > 0 && plan !== 'enterprise' && (
        <p className="mt-1 text-xs text-gray-11">
          Tags limit: <span className="font-semibold">{tags.length}</span> /{' '}
          <span className="font-semibold">{limit}</span>
        </p>
      )}
    </section>
  );
};
