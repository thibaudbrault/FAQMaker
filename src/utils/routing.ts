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
    BILLING: '/api/stripe/billing',
    CHECKOUT: '/api/stripe/checkout',
    WEBHOOKS: '/api/stripe/webhooks',
  },
} as const;
