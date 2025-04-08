import { apiClient } from "../instance/client"

// const signup = async (formData: {   email: string, password: string, nickname: string,birth: string, image: string }) => {
const signup = async (formData: FormData) => {
  const response = await apiClient.post('/users', formData, {
    headers: {
      "Content-Type": "multipart/form-data", // 직접 설정도 가능
    },
  });
  return response;
};

const checkEmail = async (email: string) => {
  const response = await apiClient.get(`/users/email`,{
    params: {value: email}
  });
  return response;
};

const checkNickname = async (nickname: string) => {
  const response = await apiClient.get(`/users/nickname`, {
    params: {value: nickname}
  });
  return response;
}

export { signup, checkEmail, checkNickname };