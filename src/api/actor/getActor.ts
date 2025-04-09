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

const detailActors = async (makerId: number) => {
  console.log('detailActors 내부:', makerId);

  const response = await apiClient.get(`/makers/${makerId}`);
  console.log('response: ', response.data);
  console.log('영화인 정보 : ', response.data.data.name);
  return response.data.data;
}



export { getActors, detailActors, searchActor };
