import { MeProvider } from '@/contexts';
import { ErrorBoundaryWrapper, SuspenseWrapper } from '@/lib';
import { Footer, Header } from '@/modules';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  id: string;
  company: string;
};

export const PageLayout = ({ children, id, company }: Props) => {
  return (
    <ErrorBoundaryWrapper errorFallbackType="screen">
      <SuspenseWrapper loaderType="screen">
        <MeProvider>
          <main className="flex flex-col bg-stone-200 min-h-screen h-full">
            <Header id={id} company={company} />
            <div className="my-12 flex-grow">{children}</div>
            <Footer />
          </main>
        </MeProvider>
      </SuspenseWrapper>
    </ErrorBoundaryWrapper>
  );
};
