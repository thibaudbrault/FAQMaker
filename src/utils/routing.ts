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

export const RegisterRoutes = [
  {
    title: 'Company',
    number: 1,
    route: Routes.SITE.REGISTER.INDEX,
  },
  {
    title: 'User',
    number: 2,
    route: Routes.SITE.REGISTER.USER,
  },
  {
    title: 'Plan',
    number: 3,
    route: Routes.SITE.REGISTER.PLAN,
  },
  {
    title: 'Confirm',
    number: 4,
    route: Routes.SITE.REGISTER.CONFIRM,
  },
];
