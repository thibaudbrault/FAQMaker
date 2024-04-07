import { useQuery } from '@tanstack/react-query';

import { getUser } from '@/actions';
import { QueryKeys } from '@/utils';

export const useUser = (id: string) => {
  return useQuery({
    queryKey: [QueryKeys.USER, id],
    queryFn: async () => getUser(id),
  });
};
