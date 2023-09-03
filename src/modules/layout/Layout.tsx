import React, { ReactNode } from 'react';
import { Header } from '../header';
import { Footer } from '../footer';

type Props = {
  email?: string;
  company?: string;
  children: ReactNode;
};

export const Layout = ({ email, company = 'FAQMaker', children }: Props) => {
  return (
    <>
      <Header email={email} company={company} />
      {children}
      <Footer />
    </>
  );
};
