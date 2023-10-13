import { withAuth } from 'next-auth/middleware';

import { Routes } from './utils';

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      const pathname = req.url;
      if (token) return true;
      if (pathname === `${process.env.NEXT_PUBLIC_SITE_URL}/register`)
        return true;
      if (pathname === `${process.env.NEXT_PUBLIC_SITE_URL}/register/user`)
        return true;
      if (pathname === `${process.env.NEXT_PUBLIC_SITE_URL}/register/plan`)
        return true;
      if (
        pathname ===
        `${process.env.NEXT_PUBLIC_SITE_URL}/register/plan?status=cancel`
      )
        return true;
      if (pathname === `${process.env.NEXT_PUBLIC_SITE_URL}/register/confirm`)
        return true;
      if (
        pathname === `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/checkout`
      )
        return true;
      if (
        pathname ===
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/checkout/webhooks`
      )
        return true;
      if (
        pathname === `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/customer`
      )
        return true;
      if (pathname === `${process.env.NEXT_PUBLIC_SITE_URL}/api/tenant`)
        return true;
    },
  },
  pages: {
    signIn: Routes.SITE.LOGIN,
  },
});
