import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id?: string;
    };
  }

  interface Profile {
    picture?: string;
  }
}
