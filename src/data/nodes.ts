import axios from 'axios';

export const getNodes = async (tenant: string) => {
  const { data } = await axios.get('/api/nodes', {
    params: { tenant },
  });
  return data;
};

export const createNode = async (values, user) => {
  const body = {
    text: values.text,
    tenantId: user.user.tenantId,
    userId: user.user.id,
  };
  await axios.post('/api/nodes', body);
};
