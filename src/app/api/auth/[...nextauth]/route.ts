import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';

import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import type { NextAuthOptions } from 'next-auth';
import { sendVerificationRequest } from '@/lib';

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
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  pages: {
    signIn: Routes.SITE.LOGIN,
    error: Routes.SITE.LOGIN,
  },
  callbacks: {
    async signIn({ profile, account, user }) {
      if (!account || !user) {
        return false;
      }
      const userExists = await prisma.user.findUnique({
        where: { email: user?.email },
      });
      if (!userExists) {
        return false;
      }
      if (
        account?.provider === 'google' &&
        (!userExists.name || !userExists.image)
      ) {
        await prisma.user.update({
          where: { id: userExists?.id },
          data: {
            name: profile?.name,
            image: profile?.picture,
          },
        });
      }
      return true;
    },
    async jwt({ token, account, user }) {
      console.log('🚀 ~ jwt ~ user:', user);
      console.log('🚀 ~ jwt ~ account:', account);
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
