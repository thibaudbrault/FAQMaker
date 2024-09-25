type Props = {
  company: string;
};

export const Footer = ({ company }: Props) => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex w-full items-center justify-between border-t border-t-gray-6 bg-primary-foreground px-8 py-2 text-xs text-primary">
      <p>© {year} FAQMaker</p>
      <p className="text-sm font-bold">{company}</p>
      <a href="mailto:contact@faqmaker.co" className="hover:underline">
        Contact
      </a>
    </footer>
  );
};
