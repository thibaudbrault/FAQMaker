import React from 'react';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="text-negative w-full bg-negative px-8 py-2 text-xs">
      <p>© {year} FAQMaker</p>
    </footer>
  );
};
