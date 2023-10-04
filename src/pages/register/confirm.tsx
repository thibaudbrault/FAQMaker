import { useEffect, useState } from 'react';

import { Check, MoveLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Button, errorToast } from '@/components';
import { useCreateCustomer, useCreateTenant } from '@/hooks';
import { AuthLayout } from '@/layouts';
import { registerAtom } from '@/store';
import { useAtom } from 'jotai';
import { AxiosError } from 'axios';

function Confirm() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [state, setState] = useAtom(registerAtom);
  const router = useRouter();
  const { handleSubmit } = useForm({ defaultValues: state });

  const {
    mutateAsync: mutateTenant,
    isError: tenantIsError,
    error: tenantError,
  } = useCreateTenant(router);
  const {
    data: customerId,
    mutateAsync: mutateCustomer,
    isSuccess,
    isError: customerIsError,
    error: customerError,
  } = useCreateCustomer();

  const onSubmit = async (values) => {
    await mutateCustomer(values);
    await mutateTenant(values);
  };

  if (
    (tenantIsError && tenantError instanceof AxiosError) ||
    (customerIsError && customerError instanceof AxiosError)
  ) {
    const error = tenantError ?? customerError;
    const errorMessage = error?.response?.data.message || 'An error occurred';
    errorToast(errorMessage);
  }

  useEffect(() => {
    if (isSuccess) {
      setState({ ...state, customerId });
    }
  }, [isSuccess, customerId]);

  useEffect(() => {
    setDisabled(Object.keys(state).length === 0);
  }, [state]);

  return (
    <AuthLayout hasBackground>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <fieldset className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-1 text-center">
            <legend
              className="font-serif text-5xl font-bold lowercase"
              style={{ fontVariant: 'small-caps' }}
            >
              Confirm
            </legend>
            <p className="text-sm text-offset">Confirm the information</p>
          </div>
          <div>
            <p className="mb-2 text-xl font-bold">Company</p>
            <div className="grid grid-cols-4 grid-rows-1 gap-4">
              <p className="text-sm">Name</p>
              <p className="col-span-3 font-bold">{state.company}</p>
            </div>
            <div className="grid grid-cols-4 grid-rows-1 gap-4">
              <p className="text-sm">Email</p>
              <p className="col-span-3 font-bold">{state.companyEmail}</p>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xl font-bold">User</p>
            <div className="grid grid-cols-4 grid-rows-1 gap-8">
              <p className="text-sm">Email</p>
              <p className="col-span-3 font-bold">{state.email}</p>
            </div>
          </div>
        </fieldset>
        <div className="flex w-full items-center justify-between gap-4">
          <Button
            variant="secondary"
            size="full"
            icon="withIcon"
            font="large"
            weight="bold"
            className="lowercase"
            style={{ fontVariant: 'small-caps' }}
            type="button"
            onClick={() => router.push('/register/user')}
          >
            <MoveLeft />
            Previous
          </Button>
          <Button
            variant={disabled ? 'disabled' : 'primaryDark'}
            size="full"
            icon="withIcon"
            font="large"
            weight="bold"
            className="lowercase"
            style={{ fontVariant: 'small-caps' }}
            disabled={disabled}
          >
            Submit
            <Check />
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Confirm;
