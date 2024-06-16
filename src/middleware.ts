export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/', '/question', '/question/:path*', '/profile', '/settings'],
};
