import { ReactNode } from 'react';

import { MeProvider } from '@/contexts';
import { ErrorBoundaryWrapper, SuspenseWrapper } from '@/lib';
import { Footer, Header } from '@/modules';

type Props = {
  children: ReactNode;
  id: string;
  company: string;
  tenantId: string;
};

export const PageLayout = ({ children, id, company, tenantId }: Props) => {
  return (
    <ErrorBoundaryWrapper errorFallbackType="screen">
      <SuspenseWrapper loaderType="screen">
        <MeProvider>
          <main className="flex h-full min-h-screen flex-col bg-neutral-200 dark:bg-neutral-950">
            <Header id={id} company={company} tenantId={tenantId} />
            <div className="my-12 flex-grow">{children}</div>
            <Footer company={company} />
          </main>
        </MeProvider>
      </SuspenseWrapper>
    </ErrorBoundaryWrapper>
  );
};
