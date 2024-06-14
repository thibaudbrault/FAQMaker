export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/', '/question', '/question/:path*', '/profile', '/settings'],
};
