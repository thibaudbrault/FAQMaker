import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import ApiError from '../error';
import prisma from 'lib/prisma';
import { userLoginSchema } from '../validations/user';
import { UserLogin } from '@/types';

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
    where: { email },
  });

  if (!user) {
    return {
      user: null,
      error: new ApiError(`User with email: ${email} does not exist.`, 404),
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
