import { AuthLayoutProvider } from '@/context';

import Form from './form';

export default function Page() {
  return (
    <AuthLayoutProvider hasBackground currentStep={3}>
      <Form />
    </AuthLayoutProvider>
  );
}
