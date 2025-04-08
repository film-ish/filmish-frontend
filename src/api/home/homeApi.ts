import { apiClient } from "../instance/client";


const getmovie = async () => {
  console.log('getmovie API 호출');
  try {
    const response = await apiClient.get("/");
    console.log('getmovie API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('getmovie API 오류:', error);
    throw error;
  }
};

const getrecommend = async () => {
  const response = await apiClient.get("/recommendation");
  return response.data;
};

export { getmovie, getrecommend };
