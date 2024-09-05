'use client';

import { useEffect } from 'react';

import { Button } from '@/components';

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
      <Button
        variant="destructive"
        weight="semibold"
        size="medium"
        font="large"
        className="lowercase"
        style={{ fontVariant: 'small-caps' }}
        onClick={() => reset()}
      >
        Try again
      </Button>
    </div>
  );
}
