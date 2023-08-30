import axios from 'axios';

export const createAnswer = async (values, nodeId) => {
  const body = {
    text: values.text,
    nodeId,
  };
  await axios.post('/api/answer', body);
};
