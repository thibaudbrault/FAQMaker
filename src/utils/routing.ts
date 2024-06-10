export const Routes = {
  SITE: {
    HOME: '/',
    LOGIN: '/login',
    SETTINGS: '/settings',
    PROFILE: '/profile',
    ANSWER: '/question/answer',
    QUESTION: {
      INDEX: '/question',
      NEW: '/question/new',
      EDIT: '/question/edit',
    },
    REGISTER: {
      INDEX: '/register',
      USER: '/register/user',
      CONFIRM: '/register/confirm',
      PLAN: '/register/plan',
    },
  },
  API: {
    USERS: {
      INDEX: '/api/users',
      COUNT: '/api/users/count',
    },
    NODES: {
      INDEX: '/api/nodes',
      COUNT: '/api/nodes/count',
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
    TENANT: {
      INDEX: '/api/tenant',
      LOGO: '/api/tenant/logo',
    },
    WEBHOOKS: '/api/stripe/webhooks',
    STORAGE: {
      LOGO: '/api/storage/logo',
    },
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
