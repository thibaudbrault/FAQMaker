import { Button } from '@/components';
import { useRegisterState } from '@/contexts';
import { AuthLayout } from '@/layouts';
import { Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';

function Plan() {
  const [state, setState] = useRegisterState();
  const [selected, setSelected] = useState<string>('');

  const plans = useMemo(
    () => [
      {
        label: 'Free',
        value: 'free',
        price: 0,
        priceId: '',
      },
      {
        label: 'Business',
        value: 'business',
        price: 29,
        priceId: 'price_1NsiZpDrot5aQrVBMkNYEvHY',
      },
      {
        label: 'Enterprise',
        value: 'enterprise',
        price: 49,
        priceId: 'price_1NsiaSDrot5aQrVBVUb9xzTw',
      },
    ],
    [],
  );

  return (
    <AuthLayout>
      <form
        action="/api/checkout_sessions"
        method="POST"
        className="flex min-w-[500px] flex-col items-center gap-8 rounded-md bg-green-50 p-8"
      >
        <fieldset className="w-full">
          <div className="mb-4 flex w-full flex-col gap-2 text-center">
            <legend
              className="font-serif text-5xl font-bold lowercase"
              style={{ fontVariant: 'small-caps' }}
            >
              Plan
            </legend>
            <p className="text-sm">Choose the right plan for you</p>
          </div>
          <ul className="flex gap-4">
            {plans.map((plan, index) => (
              <li
                key={index}
                className={`border-default rounded-md border ${
                  plan.value === selected && 'bg-red-500'
                }`}
              >
                <button type="button" onClick={() => setSelected(plan.value)}>
                  <h2>{plan.label}</h2>
                </button>
              </li>
            ))}
          </ul>
          <Button
            variant="primaryDark"
            size="full"
            icon="withIcon"
            font="large"
            weight="bold"
            className="lowercase"
            style={{ fontVariant: 'small-caps' }}
            type="submit"
          >
            <Wallet />
            Checkout
          </Button>
        </fieldset>
      </form>
    </AuthLayout>
  );
}

export default Plan;
