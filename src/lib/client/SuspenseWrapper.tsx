import { Loader, LoaderProps } from '@/components';
import { ReactNode, Suspense } from 'react';

type Props = {
  children: ReactNode;
  loaderType: LoaderProps['size'];
};

export const SuspenseWrapper = ({ children, loaderType }: Props) => {
  return (
    <Suspense fallback={<Loader size={loaderType} />}>{children}</Suspense>
  );
};
