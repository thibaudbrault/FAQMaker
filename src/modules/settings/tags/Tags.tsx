import { Loader, errorToast } from '@/components';
import { useDeleteTag, useTags } from '@/hooks';

import { CreateTag } from './Create';

type Props = {
  tenantId: string;
};

export const Tags = ({ tenantId }: Props) => {
  const { data: tags, isLoading, isError, error } = useTags(tenantId);

  const { mutate, isLoading: isTagLoading } = useDeleteTag(tenantId);

  const handleDeleteTag = (id: string) => {
    mutate({ id });
  };

  if (isLoading) {
    return <Loader size="screen" />;
  }

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  return (
    <section className="w-3/4 mx-auto">
      {tags.length > 0 ? (
        <ul className="my-6 flex flex-wrap gap-4">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="flex items-center bg-teal-700 text-stone-200 w-fit rounded-md gap-2"
            >
              <p className="px-2">{tag.label}</p>
              <button
                className="flex items-center font-semibold bg-stone-200 border border-teal-700 text-teal-700 rounded-r-md px-2"
                onClick={() => handleDeleteTag(tag.id)}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center italic my-6">No tags</p>
      )}
      <CreateTag tenantId={tenantId} />
    </section>
  );
};
