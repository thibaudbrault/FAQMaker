import { Button, Loader } from '@/components';
import { useDeleteTag, useTags } from '@/hooks';

import { CreateTag } from './Create';

type Props = {
  tenantId: string;
};

export const Tags = ({ tenantId }: Props) => {
  const { data: tags, isPending } = useTags(tenantId);
  const { mutate, isPending: isTagLoading } = useDeleteTag(tenantId);

  const handleDeleteTag = (id: string) => {
    mutate({ id });
  };

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
    </section>
  );
};
