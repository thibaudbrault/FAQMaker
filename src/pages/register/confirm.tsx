import { useForm } from 'react-hook-form';

import { Button } from '@/components';
import { useRegisterState } from '@/contexts';
import { AuthLayout } from '@/layouts';
import { useCreateTenant } from '@/hooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Check, MoveLeft } from 'lucide-react';

function Confirm() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [state, setState] = useRegisterState();
  const router = useRouter();
  const { handleSubmit } = useForm({ defaultValues: state });

  const { mutate } = useCreateTenant(router);

  const onSubmit = (values) => {
    mutate(values);
  };

  useEffect(() => {
    setDisabled(Object.keys(state).length === 0);
  }, [state]);

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-w-[500px] flex-col items-center gap-8 rounded-md bg-green-50 p-8"
      >
        <section className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-1 text-center">
            <legend
              className="font-serif text-5xl font-bold lowercase"
              style={{ fontVariant: 'small-caps' }}
            >
              Confirm
            </legend>
            <p className="text-sm">Confirm the information</p>
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
        </section>
        <div className="flex w-full items-center justify-between gap-4">
          <Button
            variant="secondaryDark"
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
            variant={disabled ? 'disabledDark' : 'primaryDark'}
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
