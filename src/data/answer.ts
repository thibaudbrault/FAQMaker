import axios, { AxiosError } from "axios";

export const createAnswer = async (values, nodeId) => {
  try {
    const body = {
      text: values.text,
      nodeId,
    };
    await axios.post("/api/answer", body);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error);
    }
  }
};
