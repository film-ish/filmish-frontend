import { apiClient } from "../instance/client"

const signup = async (formData: {   email: string, password: string, nickname: string,birth: string, image: string }) => {
  const response = await apiClient.post('/users', formData);
  return response;
};

export { signup };