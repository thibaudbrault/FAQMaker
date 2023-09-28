import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextApiHandler } from 'next/types';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { loginUser } from '@/lib';
import ApiError from '@/lib/server/error';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';
import Stripe from 'stripe';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: `credentials`,
      name: `credentials`,
      credentials: {
        email: { label: `email`, type: `email` },
        password: { label: `Password`, type: `password` },
      },
      authorize: async (credentials) => {
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
    async signIn({ user, account, profile }) {
      const maybeUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!maybeUser) return false;
      if (account.provider === 'google' && !user.name) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: profile.name,
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
      session.user.id = token.id;
      return session;
    },
  },
  session: {
    strategy: `jwt`,
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  // events: {
  //   createUser: async ({ user }) => {
  //     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  //       apiVersion: '2023-08-16',
  //     });
  //     await stripe.customers
  //       .create({
  //         email: user.email,
  //         name: user.name,
  //       })
  //       .then(async (customer) => {
  //         return prisma.tenant.update({
  //           where: { id: user.id },
  //           data: {
  //             stripeCustomerId: customer.id,
  //           },
  //         });
  //       });
  //   },
  // },
};

const authHandler: NextApiHandler = (req, res) => {
  NextAuth(req, res, authOptions);
};

export default authHandler;
