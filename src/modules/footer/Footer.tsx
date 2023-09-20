import React from 'react';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-teal-700 px-8 py-2 text-xs text-stone-200">
      <p>© {year} FAQMaker</p>
    </footer>
  );
};
