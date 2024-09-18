'use client';

import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from './Button';

export const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="primary"
      icon={true}
      font="large"
      size="small"
      onClick={() => router.push('/')}
    >
      <MoveLeft />
      Go back
    </Button>
  );
};
