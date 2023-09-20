import React from 'react';

import { AuthLayout } from '@/layouts';

function Register() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center rounded-md bg-green-50 px-8">
        <h2
          className="mb-8 font-serif text-5xl font-bold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Register
        </h2>
      </div>
    </AuthLayout>
  );
}

export default Register;
