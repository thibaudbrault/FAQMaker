import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { IPlan } from '@/types';
import { Routes } from '@/utils';
import getStripe from '@/utils/stripe';

const createCheckout = async (data: DataObject, customerId: string) => {
  const stripe = await getStripe();
  const body = {
    ...data,
    customerId,
  };
  const checkoutSession = await axios.post(Routes.API.CHECKOUT, body);
  const result = await stripe.redirectToCheckout({
    sessionId: checkoutSession.data.id,
  });
  console.log(
    '🚀 ~ file: useCreateCheckout.ts:18 ~ createCheckout ~ result:',
    result,
  );
  return result;
};

type DataObject = {
  value: Exclude<IPlan['value'], 'free'>;
  priceId: string;
  email: string;
};

export const useCreateCheckout = (customerId: string) => {
  const mutation = useMutation({
    mutationFn: (data: DataObject) => createCheckout(data, customerId),
  });
  return mutation;
};
