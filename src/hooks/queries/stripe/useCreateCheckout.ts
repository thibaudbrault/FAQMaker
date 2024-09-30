import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { Routes, getStripe } from '@/utils';

const createCheckout = async (lookup_key: string, customerId: string) => {
  const stripe = await getStripe();
  const body = {
    lookup_key,
    customerId,
  };
  const checkoutSession = await axios.post(Routes.API.CHECKOUT, body);
  const result = await stripe?.redirectToCheckout({
    sessionId: checkoutSession.data.id,
  });
  return result;
};

export const useCreateCheckout = (customerId: string) => {
  const mutation = useMutation({
    mutationFn: (lookup_key: string) => createCheckout(lookup_key, customerId),
  });
  return mutation;
};
