import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from './Button';

export const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="primary"
      weight="semibold"
      icon="withIcon"
      font="large"
      size="small"
      className="lowercase"
      style={{ fontVariant: 'small-caps' }}
      onClick={() => router.push('/')}
    >
      <MoveLeft />
      Go back
    </Button>
  );
};
