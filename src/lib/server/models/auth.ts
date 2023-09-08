import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import slugify from 'slugify';

import { UserLogin } from '@/types';
import prisma from 'lib/prisma';

import ApiError from '../error';
import { userLoginSchema } from '../validations/user';



export const loginUser = async ({
  email,
  password,
}: UserLogin): Promise<{
  user: User | null;
  error: ApiError | null;
}> => {
  const result = userLoginSchema.safeParse({ email, password });

  if (!result.success) {
    return {
      user: null,
      error: ApiError.fromZodError(result.error),
    };
  }

  const user = await prisma.user.findUnique({
    where: { email, password },
  });

  const errorMessage = slugify('User not found');

  if (!user) {
    return {
      user: null,
      error: new ApiError(errorMessage, 404),
    };
  }

  // const isValid = bcrypt.compare(password, user.password);

  // if (!isValid) {
  //   return {
  //     user,
  //     error: new ApiError('Invalid password.', 401),
  //   };
  // }

  return { user, error: null };
};
