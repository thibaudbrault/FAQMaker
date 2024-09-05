'use client';

import { Banknote } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button, errorToast } from '@/components';
import { Routes } from '@/utils';

type Props = {
  tenantId: string;
};

export const Billing = ({ tenantId }: Props) => {
  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    const body = { tenantId };
    const response = await fetch(Routes.API.BILLING, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (response.ok) {
      window.location.assign(data.url);
    } else {
      errorToast(data.error);
    }
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
