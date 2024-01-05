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

      TEST_EMAIL: string;
      TEST_PASSWORD: string;

      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
    }
  }
}
export {};
