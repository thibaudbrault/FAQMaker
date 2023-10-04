import { FC, ReactNode } from 'react';

import {
  QueryErrorResetBoundary,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import { ErrorFallback, ErrorProps } from '@/components';
import { FallbackType } from '@/types/global';

type Props = {
  children: ReactNode;
  errorFallbackType: ErrorProps['fallbackType'];
};

export const ErrorBoundaryWrapper: FC<Props> = ({
  children,
  errorFallbackType,
}) => {
  const { reset } = useQueryErrorResetBoundary();

  const fallbackRender = (fallbackProps: FallbackProps) => (
    <ErrorFallback {...fallbackProps} fallbackType={errorFallbackType} />
  );

  return (
    <QueryErrorResetBoundary>
      <ErrorBoundary fallbackRender={fallbackRender} onReset={reset}>
        {children}
      </ErrorBoundary>
    </QueryErrorResetBoundary>
  );
};
