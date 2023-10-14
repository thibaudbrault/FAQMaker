export const Routes = {
  SITE: {
    HOME: '/',
    LOGIN: '/login',
    SETTINGS: '/settings',
    PROFILE: '/profile',
    QUESTION: {
      NEW: '/question/new',
    },
    REGISTER: {
      INDEX: '/register',
      USER: '/register/user',
      CONFIRM: '/register/confirm',
      PLAN: '/register/plan',
    },
    _500: '/500',
  },
  API: {
    USERS: '/api/users',
    NODES: '/api/nodes',
    CHECKOUT: '/api/stripe/checkout',
    CUSTOMER: '/api/stripe/customer',
    BILLING: '/api/stripe/billing',
    ANSWERS: '/api/answers',
    QUESTIONS: '/api/questions',
    SEARCH: '/api/search',
    TAGS: '/api/tags',
    TENANT: '/api/tenant',
    WEBHOOKS: '/api/stripe/webhooks',
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
