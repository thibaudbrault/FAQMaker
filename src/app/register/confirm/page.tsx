import { Stepper } from '@/components';

import Form from './form';

export default function Page() {
  return (
    <>
      <Stepper currentStep={3} />
      <div className="mx-auto flex w-11/12 flex-col items-center gap-8 rounded-md bg-primary-foreground-alpha p-8 text-primary shadow-sm shadow-accent hover:shadow-accent-hover md:w-[500px]">
        <Form />
      </div>
    </>
  );
}
