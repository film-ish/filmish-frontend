import { apiClient } from '../instance/client';

export const logout = async () => {
  const response = await apiClient.post('/users/logout');
  return response.data;

};

