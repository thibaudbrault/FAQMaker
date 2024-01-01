declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;

      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      NEXT_PUBLIC_SITE_URL: string;
      SEED_USER_EMAIL: string;

      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      NEXT_PUBLIC_PRICE_BUSINESS: string;
      NEXT_PUBLIC_PRICE_ENTERPRISE: string;
    }
  }
}
export {};
