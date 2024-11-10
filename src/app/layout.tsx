import '@/styles/globals.css';
import type { ReactNode } from 'react';

import Providers from './providers';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
