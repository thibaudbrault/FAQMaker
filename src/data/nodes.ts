import axios, { AxiosError } from "axios";

export const getNodes = async (tenant: string) => {
  try {
    const { data } = await axios.get("/api/nodes", {
      params: { tenant },
    });
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error);
    }
  }
};

export const createNode = async (values, user) => {
  try {
    const body = {
      text: values.text,
      tenantId: user.user.tenantId,
      userId: user.user.id,
    };
    await axios.post("/api/nodes", body);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error);
    }
  }
};
