import React from "react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-teal-700 text-stone-200 absolute bottom-0 left-0 w-full text-xs px-8 py-2">
      <p>© {year} FAQMaker</p>
    </footer>
  );
};
