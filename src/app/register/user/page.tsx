import Form from './form';
import AuthLayout from '../layout';

export default function Page() {
  return (
    <AuthLayout hasBackground currentStep={2}>
      <Form />
    </AuthLayout>
  );
}
