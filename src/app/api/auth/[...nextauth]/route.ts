import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer';

import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
  ],
  pages: {
    signIn: Routes.SITE.LOGIN,
    error: Routes.SITE.LOGIN,
  },
  callbacks: {
    async signIn({ profile, account }) {
      if (!profile || !account) {
        return false;
      }
      const maybeUser = await prisma.user.findUnique({
        where: { email: profile.email },
      });
      if (!maybeUser) {
        const domain = profile.email?.split('@')[1];
        const tenant = await prisma.tenant.findUnique({ where: { domain } });
        if (!tenant) return false;
        const usersCount = await prisma.user.count({
          where: { tenantId: tenant.id },
        });
        if (
          (tenant.plan === 'free' && usersCount >= 5) ||
          (tenant.plan === 'startup' && usersCount >= 100)
        ) {
          return false;
        }
        const newUser = await prisma.user.create({
          data: {
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            role: 'user',
            tenant: { connect: { id: tenant.id } },
          },
        });
        if (!newUser) {
          return false;
        }
        return true;
      }
      if (
        account.provider === 'google' &&
        (!maybeUser.name || !maybeUser.image)
      ) {
        await prisma.user.update({
          where: { id: maybeUser.id },
          data: {
            name: profile.name,
            image: profile.picture,
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
