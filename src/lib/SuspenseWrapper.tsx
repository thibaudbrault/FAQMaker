import type { ReactNode } from 'react';
import { Suspense } from 'react';

import { Loader } from '@/components';

import type { LoaderProps } from '@/components';

type Props = {
  children: ReactNode;
  loaderType: LoaderProps['size'];
};

export const SuspenseWrapper = ({ children, loaderType }: Props) => {
  return (
    <Suspense fallback={<Loader size={loaderType} />}>{children}</Suspense>
  );
};
