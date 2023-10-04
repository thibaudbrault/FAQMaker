import '@/styles/globals.css';
import { useState } from 'react';

import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Inter, Merriweather } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import { TooltipProvider } from '@/components';

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
            cacheTime: Infinity,
            staleTime: Infinity,
            retry: false,
          },
        },
      }),
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Toaster />
          <TooltipProvider>
            <div
              className={`relative h-full min-h-screen text-default ${merriweather.variable} ${inter.variable}`}
            >
              <Component {...pageProps} />
            </div>
          </TooltipProvider>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
