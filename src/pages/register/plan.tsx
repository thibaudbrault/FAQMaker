import { useEffect, useMemo } from 'react';

import { useAtom } from 'jotai';
import { Check, Minus, MoveRight, Wallet } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Button, errorToast, successToast } from '@/components';
import { useCreateCheckout } from '@/hooks';
import { AuthLayout } from '@/layouts';
import { registerAtom } from '@/store';
import { Routes } from '@/utils';

function Plan() {
  const [state, setState] = useAtom(registerAtom);

  const { handleSubmit } = useForm();
  const router = useRouter();
  const { status } = router.query;

  const { mutate } = useCreateCheckout();

  const saveData = (value: string, price: string) => {
    setState({ ...state, plan: value });
    if (value === 'free') {
      return router.push(Routes.SITE.LOGIN);
    } else {
      return mutate(price);
    }
  };

  const plans = useMemo(
    () => [
      {
        label: 'Free',
        value: 'free',
        price: 0,
        priceId: '',
        icon: '',
        message: 'Perfect to try out',
        benefits: ['5 users', 'Unlimited questions'],
        drawbacks: ['Slack integration', 'Theme personalization'],
      },
      {
        label: 'Business',
        value: 'business',
        price: 29,
        priceId: 'price_1NsiZpDrot5aQrVBMkNYEvHY',
        icon: '',
        message: 'Perfect for startups',
        benefits: [
          '100 users',
          'Unlimited questions',
          'Slack integration',
          'Theme personalization',
        ],
      },
      {
        label: 'Enterprise',
        value: 'enterprise',
        price: 49,
        priceId: 'price_1NsiaSDrot5aQrVBVUb9xzTw',
        icon: '',
        message: 'Perfect for big companies',
        benefits: [
          'Unlimited users',
          'Unlimited questions',
          'Slack integration',
          'Theme personalization',
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    if (status === 'success') {
      successToast('Payment successful');
      router.push(Routes.SITE.LOGIN);
    } else if (status === 'cancel') {
      errorToast('Payment unsuccessful');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router.isReady]);

  return (
    <AuthLayout>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 rounded-md p-8">
        <div className="mb-4 flex w-full flex-col gap-2 text-center">
          <h2
            className="font-serif text-5xl font-bold lowercase text-negative"
            style={{ fontVariant: 'small-caps' }}
          >
            Plan
          </h2>
          <p className="text-sm text-negativeOffset">
            Choose the right plan for you
          </p>
        </div>
        <section className="grid grid-cols-1 justify-evenly gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <form
              onSubmit={handleSubmit(() => saveData(plan.value, plan.priceId))}
              key={index}
              className="w-full transform overflow-hidden rounded-md bg-stone-100 p-4 text-center transition duration-200 ease-in hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="w-full border-b border-black py-4">
                <h2 className="text-xl uppercase">{plan.label}</h2>
                <h3 className="mt-2 text-4xl font-bold">
                  ${plan.price}/<sub className="text-xs">mo</sub>
                </h3>
              </div>
              <div className="">
                <div className="my-5">
                  <p className="pt-2 text-sm font-bold text-secondary">
                    {plan.message}
                  </p>
                </div>
                <div className="mb-10 text-lg">
                  <ul className="text-right">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex gap-2">
                        <Check className="text-secondary" />
                        <p>{benefit}</p>
                      </li>
                    ))}
                    {plan.drawbacks?.map((drawback, index) => (
                      <li
                        key={index}
                        className="flex gap-2 text-offset opacity-70"
                      >
                        <Minus className="text-offset" />
                        <p>{drawback}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 w-full">
                    {plan.value === 'free' ? (
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
                        Next
                        <MoveRight />
                      </Button>
                    ) : (
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
                    )}
                  </div>
                </div>
              </div>
            </form>
          ))}
        </section>
      </div>
    </AuthLayout>
  );
}

export default Plan;
