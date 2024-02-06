import '@/styles/globals.css';
import { useState } from 'react';

import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Inter, Merriweather } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

import { ThemeProvider, TooltipProvider } from '@/components';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-merriweather',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
});

function App({ Component, pageProps: { session, ...pageProps } }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 60 * 1000,
            staleTime: 60 * 1000,
            retry: false,
            throwOnError: true,
          },
        },
      }),
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster
              closeButton
              richColors
              position="top-center"
              toastOptions={{
                style: { fontSize: '1rem' },
              }}
            />
            <TooltipProvider>
              <div
                className={`relative h-full min-h-screen text-default dark:text-negative ${merriweather.variable} ${inter.variable}`}
              >
                <Component {...pageProps} />
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
