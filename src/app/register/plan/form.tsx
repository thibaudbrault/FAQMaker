'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { Check, Minus, MoveRight, Wallet } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  Button,
  type CarouselApi,
  errorToast,
  successToast,
} from '@/components';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components';
import { registerAtom } from '@/store';
import { Routes, getStripe } from '@/utils';

import type { IPlan } from '@/types';


export default function Form() {
  const [state, setState] = useAtom(registerAtom);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const { handleSubmit } = useForm();
  const router = useRouter();
  const params = useParams();
  const { status } = params;

  const saveData = async (value: IPlan['value'], lookup_key: string) => {
    if (value === 'free') {
      setState(RESET);
      router.push(Routes.SITE.LOGIN);
    } else {
      const body = { customerId: state.customerId, lookup_key };
      const stripe = await getStripe();
      const response = await fetch(Routes.API.CHECKOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const checkoutSession = await response.json();
      if (response.ok) {
        await stripe?.redirectToCheckout({
          sessionId: checkoutSession.id,
        });
      } else {
        errorToast(checkoutSession.error);
      }
    }
  };

  const plans: IPlan[] = useMemo(
    () => [
      {
        label: 'Free',
        value: 'free',
        price: 0,
        lookup_key: 'free_monthly',
        message: 'Perfect to try out',
        benefits: ['5 users', '3 tags', 'Unlimited questions'],
        drawbacks: ['Slack integration'],
      },
      {
        label: 'Startup',
        value: 'startup',
        price: 19,
        lookup_key: 'startup_monthly',
        message: 'Perfect for startups',
        benefits: [
          '100 users',
          '10 tags',
          'Unlimited questions',
          'Slack integration',
        ],
      },
      {
        label: 'Enterprise',
        value: 'enterprise',
        price: 29,
        lookup_key: 'enterprise_monthly',
        message: 'Perfect for big companies',
        benefits: [
          'Unlimited users',
          'Unlimited tags',
          'Unlimited questions',
          'Slack integration',
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    if (status === 'success') {
      successToast('Payment successful');
      setState(RESET);
      router.push(Routes.SITE.LOGIN);
    } else if (status === 'cancel') {
      errorToast('Payment unsuccessful');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: 'center' }}
        className="mx-auto w-3/4"
      >
        <CarouselContent>
          {plans.map((plan) => (
            <CarouselItem className="w-fit overflow-hidden rounded-md text-center text-primary">
              <form
                onSubmit={handleSubmit(() =>
                  saveData(plan.value, plan.lookup_key),
                )}
                key={plan.value}
              >
                <div>
                  <h3 className="text-sm font-semibold uppercase text-accent-secondary">
                    {plan.label}
                  </h3>
                  <p className="mt-2 text-4xl font-bold">
                    ${plan.price}/<sub className="text-xs">mo</sub>
                  </p>
                </div>
                <hr className="mx-auto my-6 h-px w-3/4 border-none bg-divider" />
                <p className="mb-2 text-sm font-bold text-primary">
                  {plan.message}
                </p>
                <div className="mb-10 text-lg">
                  <ul className="list-none text-right">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-2">
                        <Check className="text-accent" />
                        <p>{benefit}</p>
                      </li>
                    ))}
                    {plan.drawbacks?.map((drawback) => (
                      <li
                        key={drawback}
                        className="flex gap-2 text-primary-muted opacity-70"
                      >
                        <Minus className="text-primary-muted" />
                        <p>{drawback}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 w-full">
                    {plan.value === 'free' ? (
                      <Button
                        variant="primary"
                        size="full"
                        icon={true}
                        font="large"
                        weight="bold"
                        type="submit"
                      >
                        Next
                        <MoveRight />
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="full"
                        icon={true}
                        font="large"
                        weight="bold"
                        type="submit"
                      >
                        <Wallet />
                        Checkout
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <small className="py-2 text-center text-sm text-primary-muted">
        Plan {current} of {count}
      </small>
    </>
  );
}
