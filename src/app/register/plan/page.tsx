import { AuthLayoutProvider } from '@/context';

import Form from './form';

export default function Page() {
  return (
    <AuthLayoutProvider noStepper>
      <Form />
    </AuthLayoutProvider>
  );
}
