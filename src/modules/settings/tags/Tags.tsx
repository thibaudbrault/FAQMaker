import { Tag } from '@prisma/client';
import { AxiosError } from 'axios';

import { Button, Loader, errorToast } from '@/components';
import { useDeleteTag } from '@/hooks';

import { CreateTag } from './Create';

type Props = {
  tags: Tag[];
  isLoading: boolean;
  tenantId: string;
};

export const Tags = ({ tags, isLoading, tenantId }: Props) => {
  const {
    mutate,
    isLoading: isTagLoading,
    isError,
    error,
  } = useDeleteTag(tenantId);

  const handleDeleteTag = (id: string) => {
    mutate({ id });
  };

  if (isLoading || isTagLoading) {
    return <Loader size="screen" />;
  }

  if (isError && error instanceof AxiosError) {
    const errorMessage = error.response?.data.message || 'An error occurred';
    errorToast(errorMessage);
  }

  return (
    <section className="mx-auto w-3/4">
      {tags.length > 0 ? (
        <ul className="my-6 flex flex-wrap gap-4">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="flex w-fit items-center gap-2 rounded-md bg-negative text-negative"
            >
              <p className="px-2">{tag.label}</p>
              <Button
                variant="primaryDark"
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
    </section>
  );
};
