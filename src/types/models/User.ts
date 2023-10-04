import { User } from '@prisma/client';

export type ClientUser = Omit<User, 'password'>;

export type UserLogin = {
  email: string;
  password: string;
};
