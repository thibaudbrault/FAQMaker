import { ShieldAlert, UserIcon } from 'lucide-react';

import { Button, Loader } from '@/components';
import { useUsers } from '@/hooks';

import { CreateUser } from './Create';

type Props = {
  tenantId: string;
};

export const Users = ({ tenantId }: Props) => {
  const { data: users, isLoading, isError, error } = useUsers(tenantId);

  if (isLoading) {
    return <Loader size="page" />;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  const iconStyle = 'w-9 h-9 m-3 inline-flex flex-shrink-0 items-center';

  return (
    <section className="w-3/4 mx-auto">
      <ul className="flex flex-col gap-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-white border border-stone-200 p-6 rounded-md shadow-sm"
          >
            <div className="flex justify-between">
              <div className="flex justify-start">
                {user.role === 'user' ? (
                  <UserIcon className={iconStyle} />
                ) : (
                  <ShieldAlert className={iconStyle} />
                )}
                <div className="flex flex-col items-start">
                  <h2 className="text-2xl">
                    <b>
                      {user.firstName} {user.lastName}
                    </b>
                  </h2>
                  <p>{user.email}</p>
                </div>
              </div>
              <Button
                variant="primaryDark"
                weight="semibold"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                Modify
              </Button>
            </div>
          </li>
        ))}
        <CreateUser tenantId={tenantId} />
      </ul>
    </section>
  );
};
