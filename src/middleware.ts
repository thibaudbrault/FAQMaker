import { withAuth } from 'next-auth/middleware';

import { Routes } from './utils';

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      const pathname = req.url;
      if (token) return true;
      if (pathname === `${process.env.NEXT_PUBLIC_SITE_URL}/register`)
        return true;
    },
  },
  pages: {
    signIn: Routes.SITE.LOGIN,
  },
});
