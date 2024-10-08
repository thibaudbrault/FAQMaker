'use client';

import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from './Button';

export const BackButton = () => {
  return (
    <Button variant="primary" icon={true} font="large" size="small" asChild>
      <Link href="/">
        <MoveLeft />
        Go back
      </Link>
    </Button>
  );
};
