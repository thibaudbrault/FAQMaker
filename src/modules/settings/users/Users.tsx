import { $Enums } from '@prisma/client';
import { AxiosError } from 'axios';
import { ShieldAlert, UserIcon } from 'lucide-react';

import { Button, Loader, errorToast } from '@/components';
import { useDeleteUser, useUsers } from '@/hooks';

import { CreateUser } from './Create';
import { FileInput } from './FileInput';
import { UpdateUser } from './Update';

type Props = {
  userId: string;
  tenantId: string;
  plan: $Enums.Plan;
};

export const Users = ({ userId, tenantId, plan }: Props) => {
  const { data: users, isPending } = useUsers(tenantId);

  const {
    mutate,
    isPending: isUserLoading,
    isError,
    error,
  } = useDeleteUser(tenantId);

  const handleDeleteUser = (id: string) => {
    mutate({ id });
  };

  if (isPending || isUserLoading) {
    return <Loader size="page" />;
  }

  if (isError && error instanceof AxiosError) {
    const errorMessage = error.response?.data.message || 'An error occurred';
    errorToast(errorMessage);
  }

  const iconStyle = 'w-9 h-9 m-3 inline-flex flex-shrink-0 items-center';

  return (
    <section className="mx-auto w-11/12 md:w-3/4">
      <ul className="flex list-none flex-col gap-4">
        {users?.map((user) => (
          <li
            key={user.id}
            className="rounded-md border border-stone-200 bg-default p-6 shadow-sm"
          >
            <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:gap-0">
              <div className="flex items-center justify-start">
                {user.role === 'user' ? (
                  <UserIcon className={iconStyle} />
                ) : (
                  <ShieldAlert className={iconStyle} />
                )}
                <div className="flex flex-col items-start">
                  <h2 className="text-2xl">
                    <b>{user.name}</b>
                  </h2>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <UpdateUser user={user} tenantId={tenantId} />
                {(user.role === 'user' || user.id !== userId) && (
                  <Button
                    variant="secondary"
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
          </li>
        ))}
        <CreateUser tenantId={tenantId} />
        <div className="flex items-center gap-4">
          <div className="h-px flex-grow bg-negative" />
          <p className="text-center text-xl font-bold uppercase">or</p>
          <div className="h-px flex-grow bg-negative" />
        </div>
        <FileInput tenantId={tenantId} users={users} plan={plan} />
      </ul>
    </section>
  );
};
