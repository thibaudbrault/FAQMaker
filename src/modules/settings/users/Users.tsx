import { ShieldAlert, UserIcon } from 'lucide-react';

import { Button, Loader, errorToast } from '@/components';
import { useDeleteUser, useUsers } from '@/hooks';

import { CreateUser } from './Create';
import { UpdateUser } from './Update';

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
    <section className="mx-auto w-3/4">
      <ul className="flex flex-col gap-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="rounded-md border border-stone-200 bg-stone-100 p-6 shadow-sm"
          >
            <div className="flex justify-between">
              <div className="flex w-full justify-between">
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
                  <UpdateUser user={user} tenantId={tenantId} />
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
