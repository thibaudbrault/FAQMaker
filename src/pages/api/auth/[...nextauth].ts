import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextApiHandler } from 'next/types';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { Routes } from '@/utils';
import prisma from 'lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: Routes.SITE.LOGIN,
    error: Routes.SITE.LOGIN,
  },
  callbacks: {
    async signIn({ user, account }) {
      const maybeUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!maybeUser) {
        const domain = user.email.split('@')[1];
        const tenant = await prisma.tenant.findUnique({ where: { domain } });
        if (!tenant) return false;
        const usersCount = await prisma.user.count({
          where: { tenantId: tenant.id },
        });
        if (
          (tenant.plan === 'free' && usersCount >= 5) ||
          (tenant.plan === 'business' && usersCount >= 100)
        ) {
          return false;
        }
        const newUser = await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            image: user.image,
            role: 'user',
            tenant: { connect: { id: tenant.id } },
          },
        });
        if (!newUser) {
          return false;
        }
        return true;
      }
      if (account.provider === 'google' && (!user.name || !user.image)) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: user.name,
            image: user.image,
          },
        });
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
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
