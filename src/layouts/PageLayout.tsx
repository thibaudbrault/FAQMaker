import { ReactNode, useEffect } from 'react';

import { MeProvider } from '@/contexts';
import { ErrorBoundaryWrapper, SuspenseWrapper } from '@/lib';
import { Footer, Header } from '@/modules';
import { themeAtom } from '@/store';
import { useAtomValue } from 'jotai';

type Props = {
  children: ReactNode;
  id: string;
  company: string;
  tenantId: string;
};

export const PageLayout = ({ children, id, company, tenantId }: Props) => {

  const selectedTheme = useAtomValue(themeAtom);

  useEffect(() => {
    document.documentElement.className = `theme-${selectedTheme}`;
  }, [selectedTheme]);

  return (
    <ErrorBoundaryWrapper errorFallbackType="screen">
      <SuspenseWrapper loaderType="screen">
        <MeProvider>
          <main className="flex h-full min-h-screen flex-col bg-stone-200">
            <Header id={id} company={company} tenantId={tenantId} />
            <div className="my-12 flex-grow">{children}</div>
            <Footer company={company} />
          </main>
        </MeProvider>
      </SuspenseWrapper>
    </ErrorBoundaryWrapper>
  );
};
