import React from 'react';

type Props = {
  company: string;
};

export const Footer = ({ company }: Props) => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex w-full items-center justify-between bg-negative px-8 py-2 text-xs text-negative">
      <p>© {year} FAQMaker</p>
      <p className="text-sm font-bold">{company}</p>
      <a href="mailto:contact@faqmaker.co" className="hover:underline">
        contact@faqmaker.co
      </a>
    </footer>
  );
};
