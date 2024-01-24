import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useAtom } from 'jotai';
import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Loader, errorToast } from '@/components';
import { useCreateCustomer, useCreateTenant } from '@/hooks';
import { AuthLayout } from '@/layouts';
import { registerCompleteClientSchema } from '@/lib';
import { registerAtom } from '@/store';
import { Routes, cn } from '@/utils';

type Schema = z.infer<typeof registerCompleteClientSchema>;

function Confirm() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [state, setState] = useAtom(registerAtom);
  const router = useRouter();
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(registerCompleteClientSchema),
    defaultValues: state,
  });

  const { data: customerId, mutateAsync: mutateCustomer } = useCreateCustomer();
  const { mutateAsync: mutateTenant, isSuccess } = useCreateTenant(router);

  const onSubmit: SubmitHandler<Schema> = async (values) => {
    try {
      await mutateTenant(values);
      await mutateCustomer(values);
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setState({ ...state, customerId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, customerId]);

  useEffect(() => {
    setDisabled(!isValid || isSubmitting);
  }, [isValid, isSubmitting]);

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
            <div className="grid grid-cols-4 grid-rows-1 gap-4">
              <p className="text-sm">Domain</p>
              <p
                className={`col-span-3 ${
                  state.domain ? 'font-bold' : 'italic'
                }`}
              >
                {state.domain || 'No domain'}
              </p>
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
            onClick={() => router.push(Routes.SITE.REGISTER.USER)}
          >
            <MoveLeft />
            Previous
          </Button>
          <Button
            variant={disabled ? 'disabled' : 'primary'}
            size="full"
            font="large"
            weight="bold"
            className="lowercase"
            style={{ fontVariant: 'small-caps' }}
            disabled={disabled}
          >
            Submit
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Confirm;
