import { Banknote } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components';
import { useCreateBillingPortal } from '@/hooks';

type Props = {
  tenantId: string;
};

export const Billing = ({ tenantId }: Props) => {
  const { handleSubmit } = useForm();
  const { mutate } = useCreateBillingPortal(tenantId);

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
