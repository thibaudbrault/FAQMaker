import Form from './form';
import AuthLayout from '../layout';

export default function Page() {
  return (
    <AuthLayout hasBackground currentStep={3}>
      <Form />
    </AuthLayout>
  );
}
