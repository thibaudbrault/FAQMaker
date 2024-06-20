'use client';

import { deleteUser } from '@/actions';
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components';

import { CreateUser } from './Create';
import { FileInput } from './FileInput';
import { UpdateUser } from './Update';

import type { $Enums, User } from '@prisma/client';

type Props = {
  userId: string;
  tenantId: string;
  plan: $Enums.Plan;
  users: User[] | null;
  usersCount: number;
};

const UserAvatar = ({ id, email, image }) => {
  const placeholderImage = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${id}&radius=50`;
  const avatar = image ?? placeholderImage;
  return (
    <Avatar className="m-3 size-9">
      <AvatarImage src={avatar} />
      <AvatarFallback>{email[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export const Users = ({ userId, tenantId, plan, users, usersCount }: Props) => {
  const handleDeleteUser = async (id: string) => {
    await deleteUser({ id, tenantId });
  };

  return (
    <ul className="flex list-none flex-col gap-4">
      {users?.map((user) => (
        <li
          key={user.id}
          className="rounded-md bg-gray-3 p-6 shadow-sm shadow-tealA-7 hover:shadow-tealA-8"
        >
          <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:gap-0">
            <div className="flex items-center justify-start">
              <UserAvatar id={user.id} email={user.email} image={user.image} />
              <div className="flex flex-col items-start">
                <h2
                  className={`text-2xl ${
                    user.role !== 'user' ? 'text-teal-11' : ''
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
      <CreateUser tenantId={tenantId} usersCount={usersCount} />
      <div className="flex items-center gap-4">
        <div className="h-px grow bg-gray-6" />
        <p className="text-center text-xl font-bold uppercase">or</p>
        <div className="h-px grow bg-gray-6" />
      </div>
      <FileInput
        tenantId={tenantId}
        users={users}
        plan={plan}
        usersCount={usersCount}
      />
    </ul>
  );
};
