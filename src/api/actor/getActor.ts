import { apiClient } from '../instance/client';

const getActors = async (page: number, size: number) => {
  const response = await apiClient.get(
    `/makers?page=${page}&size=${size}`
  );
  return response.data.data.content;
};

export { getActors };