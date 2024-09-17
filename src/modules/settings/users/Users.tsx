'use client';

import { deleteUser } from '@/actions';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  resultToast,
} from '@/components';

import { CreateUser } from './Create';
import { FileInput } from './FileInput';
import { UpdateUser } from './Update';

import type { $Enums, User } from '@prisma/client';

type Props = {
  userId: string;
  tenantId: string;
  plan: $Enums.Plan;
  users: User[];
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
    const result = await deleteUser({ id, tenantId });
    resultToast(result?.serverError, result?.data?.message);
  };

  return (
    <section className="space-y-4">
      <h2
        className="text-xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Users
      </h2>
      <ul className="list-none space-y-2">
        {users?.map((user) => (
          <li key={user.id} className="rounded-md px-6 py-4 hover:bg-gray-4">
            <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:gap-0">
              <div className="flex items-center justify-start">
                <UserAvatar
                  id={user.id}
                  email={user.email}
                  image={user.image}
                />
                <div className="flex flex-col items-start">
                  <h2
                    className={`text-xl font-semibold ${
                      user.role !== 'user' ? 'text-teal-11' : ''
                    }`}
                  >
                    <b>{user.name}</b>
                  </h2>
                  <small className="text-gray-11">{user.email}</small>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <UpdateUser user={user} tenantId={tenantId} />
                {(user.role === 'user' || user.id !== userId) && (
                  <Button
                    variant="destructive"
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
      </ul>
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
    </section>
  );
};
