'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import { Button } from '@/components';
import { Routes } from '@/utils';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-12">
      <h2 className="text-5xl font-bold">Something went wrong!</h2>
      <p className="text-xl">{error.message}</p>
      <div className="space-x-4">
        <Button variant="destructive" font="large" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="primary" font="large" asChild>
          <Link href={Routes.SITE.LOGIN}>Login</Link>
        </Button>
      </div>
    </div>
  );
}
