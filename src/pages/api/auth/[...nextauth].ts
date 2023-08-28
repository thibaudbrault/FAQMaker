import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import { NextApiHandler } from "next/types";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "lib/prisma";
import { LoginValidator } from "@/utils/validators/login";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: `credentials`,
      credentials: {
        email: { label: `email`, type: `email` },
        password: { label: `Password`, type: `password` },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = LoginValidator.parse(credentials);
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              tenantId: true,
            },
          });
          if (!user) {
            return null;
            // throw new Error(
            //   `No user found with this email. Try with a different email`
            // );
          }
          const isPasswordValid = bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error(`Invalid credentials`);
          }
          return user;
        } catch (error) {
          console.error(`An error occured: `, error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.username;
      return session;
    },
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.username = (user as User).name;
      }
      return token;
    },
  },
  session: {
    strategy: `jwt`,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const authHandler: NextApiHandler = (req, res) => {
  NextAuth(req, res, authOptions);
};

export default authHandler;
