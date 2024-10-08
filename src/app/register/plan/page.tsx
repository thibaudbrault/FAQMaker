'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { RegisterRoutes } from '@/utils';

import Form from './form';

export default function Page() {
  const pathname = usePathname();

  return (
    <>
      <div className="flex w-full flex-col gap-2 text-left">
        <h2
          className="font-serif text-5xl font-bold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Plan
        </h2>
        <p className="text-sm text-primary-muted">
          Select the right plan for your needs
        </p>
      </div>
      <hr className="my-6 h-px border-none bg-divider" />
      <div className="flex h-full gap-16">
        <div className="flex flex-col justify-start gap-4">
          {RegisterRoutes.map((link) => (
            <Link
              href={link.route}
              className={`flex items-center gap-2 rounded-md px-4 py-2 font-semibold ${pathname === link.route ? 'bg-primary-negative text-primary-negative' : 'hover:bg-primary-foreground-hover'}`}
            >
              <span className="block flex h-8 w-8 items-center justify-center rounded-full border border-accent">
                {link.number}
              </span>
              {link.title}
            </Link>
          ))}
        </div>
        <div className="mx-auto flex w-full flex-col items-center justify-between gap-8">
          <Form />
        </div>
      </div>
    </>
  );
}
