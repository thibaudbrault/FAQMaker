declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL: string;

      DATABASE_URL: string;

      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      AUTH_GOOGLE_ID: string;
      AUTH_GOOGLE_SECRET: string;

      TEST_EMAIL: string;
      TEST_PASSWORD: string;

      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;

      SENTRY_AUTH_TOKEN: string;
      SENTRY_IGNORE_API_RESOLUTION_ERROR: number;

      PROJECT_ID: string;
      CLIENT_EMAIL: string;
      PRIVATE_KEY: string;

      RESEND_API_KEY: string;

      AWS_S3_BUCKET: string
      AWS_S3_REGION: string
      AWS_S3_ACCESS_KEY_ID: string
      AWS_S3_SECRET_ACCESS_KEY: string
      NEXT_PUBLIC_AWS_CLOUDFRONT_URL: string
      NEXT_PUBLIC_AWS_CLOUDFRONT_URL: string;
    }
  }
}
export {};
