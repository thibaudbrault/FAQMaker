export const Routes = {
  SITE: {
    HOME: '/',
    LOGIN: '/login',
    SETTINGS: '/settings',
    PROFILE: '/profile',
    _500: '/500',
  },
  API: {
    USERS: '/api/users',
    NODES: '/api/nodes',
    ANSWER: '/api/answer',
    TAGS: '/api/tags',
  },
} as const;

export const Redirects = {
  NOT_FOUND: {
    notFound: true,
  },
  _500: {
    redirect: {
      permanent: false,
      destination: Routes.SITE._500,
    },
  },
  LOGIN: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.LOGIN,
    },
  },
  HOME: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.HOME,
    },
  },
} as const;
