import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://205614d8b705aa1e52a68d3affaef461@o4506702112489472.ingest.sentry.io/4506704576380928',
  tracesSampleRate: 1,
  debug: false,
});
