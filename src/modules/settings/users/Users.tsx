import { ShieldAlert, UserIcon } from 'lucide-react';

import { Button, Loader, errorToast } from '@/components';
import { useDeleteUser, useUsers } from '@/hooks';

import { CreateUser } from './Create';

type Props = {
  meId: string;
  tenantId: string;
};

export const Users = ({ meId, tenantId }: Props) => {
  const { data: users, isLoading, isError, error } = useUsers(tenantId);

  const { mutate, isLoading: isUserLoading } = useDeleteUser(tenantId);

  const handleDeleteUser = (id: string) => {
    mutate({ id });
  };

  if (isLoading || isUserLoading) {
    return <Loader size="page" />;
  }

  if (isError && error instanceof Error) {
    errorToast(error.message);
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
              <div className="w-full flex justify-between">
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="primaryDark"
                    weight="semibold"
                    size="small"
                    className="lowercase"
                    style={{ fontVariant: 'small-caps' }}
                  >
                    Modify
                  </Button>
                  {(user.role !== 'admin' || user.id !== meId) && (
                    <Button
                      variant="secondaryDark"
                      size="small"
                      weight="semibold"
                      className="lowercase"
                      style={{ fontVariant: 'small-caps' }}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
        <CreateUser tenantId={tenantId} />
      </ul>
    </section>
  );
};
