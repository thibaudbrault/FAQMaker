import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { IPlan } from '@/types';
import { Routes, getStripe } from '@/utils';

const createCheckout = async (data: DataObject, customerId: string) => {
  const stripe = await getStripe();
  const body = {
    ...data,
    customerId,
  };
  const checkoutSession = await axios.post(Routes.API.CHECKOUT, body);
  const result = await stripe?.redirectToCheckout({
    sessionId: checkoutSession.data.id,
  });
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
