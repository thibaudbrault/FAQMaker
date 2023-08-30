import axios from 'axios';

export const getUser = async (email: string) => {
  const { data } = await axios.get('/api/user', { params: { email } });
  return data;
};

export const createUser = async (values, tenantId) => {
  const body = { ...values, tenantId };
  await axios.post('/api/user', body);
};
