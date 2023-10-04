import { Tag } from '@prisma/client';
import { AxiosError } from 'axios';

import { Loader, errorToast } from '@/components';
import { useDeleteTag } from '@/hooks';

import { CreateTag } from './Create';

type Props = {
  tags: Tag[];
  isLoading: boolean;
  isError: boolean;
  error: AxiosError;
  tenantId: string;
};

export const Tags = ({ tags, isLoading, isError, error, tenantId }: Props) => {
  const { mutate, isLoading: isTagLoading } = useDeleteTag(tenantId);

  const handleDeleteTag = (id: string) => {
    mutate({ id });
  };

  if (isLoading) {
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
              className="text-negative flex w-fit items-center gap-2 rounded-md bg-negative"
            >
              <p className="px-2">{tag.label}</p>
              <button
                className="flex items-center rounded-r-md border border-secondary bg-stone-200 px-2 font-semibold text-secondary"
                onClick={() => handleDeleteTag(tag.id)}
              >
                X
              </button>
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
