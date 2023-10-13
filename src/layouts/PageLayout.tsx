import React, { ReactNode } from 'react';

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
          <main className="flex h-full min-h-screen flex-col bg-stone-200">
            <Header id={id} company={company} tenantId={tenantId} />
            <div className="my-12 flex-grow">{children}</div>
            <Footer />
          </main>
        </MeProvider>
      </SuspenseWrapper>
    </ErrorBoundaryWrapper>
  );
};
