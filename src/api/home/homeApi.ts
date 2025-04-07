import { apiClient } from "../instance/client";


const getmovie = async () => {
  const response = await apiClient.get("/");
  return response.data;
};

const getrecommend = async () => {
  const response = await apiClient.get("/recommendation");
  return response.data;
};

export { getmovie, getrecommend };
