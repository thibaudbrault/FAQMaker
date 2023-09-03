import { loginUser } from '@/lib';
import ApiError from '@/lib/server/error';
import { Routes } from '@/utils';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from 'lib/prisma';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiHandler } from 'next/types';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: `credentials`,
      name: `credentials`,
      credentials: {
        email: { label: `email`, type: `email` },
        password: { label: `Password`, type: `password` },
      },
      authorize: async (credentials) => {
        if (!credentials) throw new ApiError('Undefined credentials', 400);

        const { user, error } = await loginUser(credentials);
        if (error) throw error;
        return user;
      },
    }),
  ],
  pages: {
    signIn: Routes.SITE.LOGIN,
    error: Routes.SITE.LOGIN,
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  session: {
    strategy: `jwt`,
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const authHandler: NextApiHandler = (req, res) => {
  NextAuth(req, res, authOptions);
};

export default authHandler;
