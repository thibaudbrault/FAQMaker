import React from 'react';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-negative px-8 py-2 text-xs text-negative">
      <p>© {year} FAQMaker</p>
    </footer>
  );
};
