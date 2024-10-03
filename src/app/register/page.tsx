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
          Company
        </h2>
        <p className="text-sm text-primary-muted">Your company details</p>
      </div>
      <hr className="my-6 h-px border-none bg-divider" />
      <div className="flex gap-16">
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
        <div className="grow-1 mx-auto flex w-full flex-col items-center gap-8 rounded-md">
          <Form />
        </div>
      </div>
    </>
  );
}
