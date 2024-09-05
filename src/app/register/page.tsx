import Form from './form';
import AuthLayout from './layout';

export default function Page() {
  return (
    <AuthLayout hasBackground currentStep={1}>
      <Form />
    </AuthLayout>
  );
}
