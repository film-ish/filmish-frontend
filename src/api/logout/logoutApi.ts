import axios from 'axios';

export const logout = async () => {
  const response = await axios.post('/users/logout');
  return response.data;

};

