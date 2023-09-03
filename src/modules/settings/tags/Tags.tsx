import { errorToast } from '@/components';
import { TabPanel } from '@tremor/react';
import React from 'react';
import { CreateTag } from './Create';
import { useTags } from '@/hooks';

type Props = {
  tenantId: string;
};

export const Tags = ({ tenantId }: Props) => {
  const { data: tags, isLoading, isError, error } = useTags(tenantId);
  console.log('🚀 ~ file: Tags.tsx:13 ~ Tags ~ tags:', tags);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  return (
    <TabPanel>
      <h3 className="text-2xl lowercase" style={{ fontVariant: 'small-caps' }}>
        Tags created
      </h3>
      {tags.length > 0 ? (
        <ul>
          {tags.map((tag) => (
            <li>
              <p>{tag.label}</p>
              <button>x</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center italic my-6">No tags</p>
      )}
      <CreateTag tenantId={tenantId} />
    </TabPanel>
  );
};
