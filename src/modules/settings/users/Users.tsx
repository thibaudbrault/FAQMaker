import { Button } from '@/components';
import { useUsers } from '@/hooks';
import { Card, Flex, Icon, TabPanel, Text, Title } from '@tremor/react';
import { ShieldAlert, UserIcon } from 'lucide-react';
import { CreateUser } from './Create';

type Props = {
  tenantId: string;
};

export const Users = ({ tenantId }: Props) => {
  const { data: users, isLoading, isError, error } = useUsers(tenantId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <TabPanel>
      <ul className="flex flex-col gap-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-white border border-stone-200 p-6 rounded-md shadow-sm"
          >
            <div className="flex justify-between">
              <div className="flex justify-start">
                <Icon
                  size="xl"
                  icon={user.role === 'user' ? UserIcon : ShieldAlert}
                  color="stone"
                />
                <div className="flex flex-col items-start">
                  <h2>
                    {user.firstName} {user.lastName}
                  </h2>
                  <p>{user.email}</p>
                </div>
              </div>
              <Button variant="primaryDark" size="medium">
                Modify
              </Button>
            </div>
          </li>
        ))}
        <CreateUser tenantId={tenantId} />
      </ul>
    </TabPanel>
  );
};
