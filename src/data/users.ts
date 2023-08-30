import axios from 'axios';

export const getUsers = async (tenantId: string) => {
  const { data } = await axios.get('/api/users', { params: { tenantId } });
  return data;
};
