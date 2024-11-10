'use client';

import { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { RegisterRoutes } from '@/utils/routing';

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function Structure({ title, subtitle, children }: Props) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex w-full flex-col gap-2 text-left">
        <h2
          className="font-serif text-5xl font-bold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          {title}
        </h2>
        <p className="text-sm text-primary-muted">{subtitle}</p>
      </div>
      <hr className="my-6 h-px border-none bg-divider" />
      <div className="flex h-full gap-16">
        <div className="flex flex-col justify-start gap-4">
          {RegisterRoutes.map((link) => (
            <div
              key={link.number}
              className={`flex items-center gap-2 rounded-md px-4 py-2 font-semibold ${pathname === link.route ? 'bg-primary-negative text-primary-negative' : ''}`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent">
                {link.number}
              </span>
              {link.title}
            </div>
          ))}
        </div>
        <div className="grow-1 mx-auto flex w-full flex-col items-center gap-8 rounded-md">
          {children}
        </div>
      </div>
    </>
  );
}
