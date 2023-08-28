import axios, { AxiosError } from "axios";

export const getUser = async (email) => {
  try {
    const { data } = await axios.get("/api/user", { params: { email } });
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error);
    }
  }
};
