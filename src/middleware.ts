import { withAuth } from 'next-auth/middleware';
import { Routes } from './utils';

export default withAuth({
  pages: {
    signIn: Routes.SITE.LOGIN,
  },
});
