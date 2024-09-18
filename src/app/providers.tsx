'use client';

import '@/styles/globals.css';
import { Provider } from 'jotai';
import { Inter, Merriweather } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

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

export default function Providers({ children }) {
  return (
    <Provider>
      <SessionProvider>
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
              className={`relative h-full min-h-screen text-primary ${merriweather.variable} ${inter.variable}`}
            >
              {children}
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </SessionProvider>
    </Provider>
  );
}
