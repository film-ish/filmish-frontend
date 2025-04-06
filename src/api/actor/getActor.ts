import { apiClient } from '../instance/client';

const getActors = async (pageNum: number = 0, pageSize: number = 10) => {
  const response = await apiClient.get(
    `/makers?pageNum=${pageNum}&pageSize=${pageSize}`
  );
  return response.data.data.content; 
};

export { getActors };