import axios from 'axios';

export const getTags = async (tenantId: string) => {
  const { data } = await axios.get('/api/tags', {
    params: { tenantId },
  });
  return data;
};

export const createTag = async (values, user) => {
  const body = {
    ...values,
    tenantId: user.tenantId,
  };
  await axios.post('/api/tags', body);
};
