import axios, { AxiosError } from "axios";

export const getUser = async () => {
  try {
    const { data } = await axios.get("/api/user");
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error);
    }
  }
};
