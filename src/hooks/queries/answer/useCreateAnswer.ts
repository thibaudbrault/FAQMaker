import { successToast } from '@/components';
import { Answer } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const createAnswer = async (values: Answer, nodeId: string, userId: string) => {
  const body = {
    text: values.text,
    nodeId,
    userId,
  };
  const { data } = await axios.post('/api/answer', body);
  return data;
};

export const useCreateAnswer = (
  reset: () => void,
  nodeId: string,
  userId: string,
  tenantId: string,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Answer) => createAnswer(values, nodeId, userId),
    onSuccess: (data) => {
      successToast(data.message);
      reset();
      queryClient.invalidateQueries({
        queryKey: ['nodes', tenantId],
      });
    },
  });
  return mutation;
};
