export const Routes = {
  SITE: {
    HOME: '/',
    LOGIN: '/login',
    SETTINGS: '/settings',
    PROFILE: '/profile',
    ANSWER: '/question/answer',
    QUESTION: {
      NEW: '/question/new',
      EDIT: '/question/edit',
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
    NODES: {
      INDEX: '/api/nodes',
      COUNT: '/api/nodes/count'
    },
    CHECKOUT: '/api/stripe/checkout',
    COLORS: '/api/colors',
    CUSTOMER: '/api/stripe/customer',
    BILLING: '/api/stripe/billing',
    ANSWERS: '/api/answers',
    QUESTIONS: '/api/questions',
    SEARCH: {
      INDEX: '/api/search',
      TAGS: '/api/search/tags',
    },
    TAGS: '/api/tags',
    TENANT: '/api/tenant',
    WEBHOOKS: '/api/stripe/webhooks',
    INTEGRATIONS: {
      INDEX: '/api/integrations',
      SLACK: '/api/integrations/slack',
    },
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
