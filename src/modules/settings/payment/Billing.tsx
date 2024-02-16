import { useAtomValue } from 'jotai';
import { Banknote } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components';
import { useCreateBillingPortal } from '@/hooks';
import { userAtom } from '@/store';

type Props = {
  tenantId: string;
};

export const Billing = ({ tenantId }: Props) => {
  const { handleSubmit } = useForm();
  const { mutate } = useCreateBillingPortal(tenantId);
  const state = useAtomValue(userAtom);
  console.log('🚀 ~ Billing ~ state:', state);

  const onSubmit = () => {
    mutate();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button
        icon="withIcon"
        variant="primary"
        weight="semibold"
        className="lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        <Banknote />
        Billing
      </Button>
    </form>
  );
};
