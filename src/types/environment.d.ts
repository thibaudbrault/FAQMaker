declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;

      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
    }
  }
}
export {};
