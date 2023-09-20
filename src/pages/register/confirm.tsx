import { useForm } from 'react-hook-form';

import { Button } from '@/components';
import { useRegisterState } from '@/contexts';
import { AuthLayout } from '@/layouts';

function Confirm() {
  const [state, setState] = useRegisterState();
  console.log('🚀 ~ file: confirm.tsx:10 ~ Confirm ~ state:', state);
  const { handleSubmit } = useForm({ defaultValues: state });

  const onSubmit = (values) => {
    console.log('🚀 ~ file: confirm.tsx:17 ~ onSubmit ~ values:', values);
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-w-[500px] flex-col items-center gap-8 rounded-md bg-green-50 p-8"
      >
        <section className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2 text-center">
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
              <p className="text-sm">First Name</p>
              <p className="col-span-3 font-bold">{state.firstName}</p>
            </div>
            <div className="grid grid-cols-4 grid-rows-1 gap-8">
              <p className="text-sm">Last Name</p>
              <p className="col-span-3 font-bold">{state.lastName}</p>
            </div>
            <div className="grid grid-cols-4 grid-rows-1 gap-8">
              <p className="text-sm">Email</p>
              <p className="col-span-3 font-bold">{state.email}</p>
            </div>
          </div>
        </section>
        <Button
          variant="primaryDark"
          size="full"
          font="large"
          weight="bold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Submit
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Confirm;
