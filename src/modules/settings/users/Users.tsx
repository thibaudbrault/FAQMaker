import { $Enums } from '@prisma/client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Loader,
} from '@/components';
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

  const { mutate, isPending: isUserLoading } = useDeleteUser(tenantId);

  const handleDeleteUser = (id: string) => {
    mutate({ id });
  };

  if (isPending || isUserLoading) {
    return <Loader size="page" />;
  }

  return (
    <ul className="flex list-none flex-col gap-4">
      {users?.map((user) => (
        <li
          key={user.id}
          className="rounded-md border border-ghost bg-default p-6 shadow-sm dark:bg-negative"
        >
          <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:gap-0">
            <div className="flex items-center justify-start">
              <UserAvatar id={user.id} email={user.email} image={user.image} />
              <div className="flex flex-col items-start">
                <h2
                  className={`text-2xl ${
                    user.role !== 'user' ? 'text-teal-11' : 'text-default'
                  }`}
                >
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
  );
};

const UserAvatar = ({ id, email, image }) => {
  const placeholderImage = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${id}&radius=50`;
  const avatar = image ?? placeholderImage;
  return (
    <Avatar className="m-3 h-9 w-9">
      <AvatarImage src={avatar} />
      <AvatarFallback>{email[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
