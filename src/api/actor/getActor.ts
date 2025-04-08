import { apiClient } from '../instance/client';

const getActors = async (page: number, size: number) => {
  const response = await apiClient.get(
    `/makers?page=${page}&size=${size}`
  );
  return response.data.data.content;
};

const searchActor = async (name: string) => {
  const response = await apiClient.get(
    `/makers?name=${name}`
  );
  return response.data.data.actors;
};

export { getActors, searchActor };