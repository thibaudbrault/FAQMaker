'use client';

import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 60 * 1000,
        staleTime: 60 * 1000,
        retry: false,
        throwOnError: true,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export default function Providers({ children }) {
  const queryClient = getQueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
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
              className={`relative h-full min-h-screen text-gray-12 ${merriweather.variable} ${inter.variable}`}
            >
              {children}
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
