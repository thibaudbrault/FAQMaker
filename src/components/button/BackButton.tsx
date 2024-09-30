import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/router';

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
      onClick={() => router.back()}
    >
      <MoveLeft />
      Go back
    </Button>
  );
};
