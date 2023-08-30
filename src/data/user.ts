import axios, { AxiosError } from 'axios';

export const getUser = async (email: string) => {
  try {
    const { data } = await axios.get('/api/user', { params: { email } });
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error);
    }
  }
};

export const createUser = async (values, tenantId) => {
  try {
    const body = { ...values, tenantId };
    await axios.post('/api/user', body);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error);
    }
  }
};
