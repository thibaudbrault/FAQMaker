import { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import ResendProvider from 'next-auth/providers/resend';

import { Routes } from '@/utils';
import prisma from 'lib/prisma';

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
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
    ResendProvider({
      apiKey: process.env.RESEND_API_KEY,
      from: 'no-reply@faqmaker.co',
    }),
  ],
  trustHost: true,
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
    async redirect({ baseUrl }) {
      return baseUrl;
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
} satisfies NextAuthConfig;
