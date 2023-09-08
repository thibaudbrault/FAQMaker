import { errorToast } from '@/components';
import { useTags } from '@/hooks';

import { CreateTag } from './Create';

type Props = {
  tenantId: string;
};

export const Tags = ({ tenantId }: Props) => {
  const { data: tags, isLoading, isError, error } = useTags(tenantId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  return (
    <section>
      <h3 className="text-2xl lowercase" style={{ fontVariant: 'small-caps' }}>
        Tags created
      </h3>
      {tags.length > 0 ? (
        <ul className="my-6 flex flex-wrap gap-4">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="flex items-center bg-teal-700 text-stone-200 w-fit rounded-md gap-2"
            >
              <p className="px-2">{tag.label}</p>
              <button className="flex items-center font-semibold bg-stone-200 border border-teal-700 text-teal-700 rounded-r-md px-2">
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
