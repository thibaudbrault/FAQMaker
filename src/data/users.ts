import axios, { AxiosError } from 'axios';

export const getUsers = async (tenantId: string) => {
  try {
    const { data } = await axios.get('/api/users', { params: { tenantId } });
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error);
    }
  }
};
