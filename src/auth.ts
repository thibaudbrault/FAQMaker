import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import ResendProvider from 'next-auth/providers/resend';
import { Routes } from './utils';
import prisma from 'lib/prisma';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    ResendProvider({
      apiKey: process.env.RESEND_API_KEY,
      from: 'auth@faqmaker.co',
    }),
  ],
  pages: {
    signIn: Routes.SITE.LOGIN,
    error: Routes.SITE.LOGIN,
  },
  callbacks: {
    async signIn({ profile, account }) {
      const maybeUser = await prisma.user.findUnique({
        where: { email: profile.email },
      });
      if (!maybeUser) {
        const domain = profile.email.split('@')[1];
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
});
