import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/navigation';

import { promiseToast } from '@/components';
import { Routes } from '@/utils';

const deleteTenant = async (values, tenantId: string, company: string) => {
  const data = {
    ...values,
    company,
  };
  const { data: deleteData } = await axios.delete(
    `${Routes.API.TENANT.INDEX}/${tenantId}`,
    { data },
  );
  return deleteData;
};

export const useDeleteTenant = (
  tenantId: string,
  company: string,
  router: NextRouter,
) => {
  const deleteTenantMutation = async (values) => {
    const promise = deleteTenant(values, tenantId, company);
    promiseToast(promise, 'Deleting account...');
    return promise;
  };
  const mutation = useMutation({
    mutationFn: deleteTenantMutation,
    onSuccess: () => {
      router.push(Routes.SITE.LOGIN);
    },
  });
  return mutation;
};
