import { errorToast } from '@/components';
import { useTags } from '@/hooks';
import { TabPanel } from '@tremor/react';
import React from 'react';
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
    <TabPanel>
      <h3>Tags in use</h3>
      <ul>
        {tags.map((tag) => (
          <li>
            <p>{tag.label}</p>
            <button>x</button>
          </li>
        ))}
      </ul>
      <CreateTag tenantId={tenantId} />
    </TabPanel>
  );
};
