import axios from 'axios';
import { idbStorage } from '../../lib/idbStorage';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  async (config) => {
    if (config.url === '/users/reissue') return config;

    const authStorage = await idbStorage.getItem('auth-storage');

    if (authStorage) {
      const { accessToken } = JSON.parse(authStorage).state;

      if (accessToken) {
        config.headers.access = accessToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 설정
apiClient.interceptors.response.use(async (response) => {
  if (response.data.code == 'AUTH_ERROR' && response.data.message == 'Token is expired') {
    const originalRequest = response.config;

    const { headers } = await apiClient.get('/users/reissue');
    const newAccessToken = headers.access;

    await idbStorage.setItem('auth-storage', JSON.stringify({ state: { accessToken: newAccessToken } }));

    originalRequest.headers.access = newAccessToken;

    return apiClient(originalRequest);
  }

  return response;
});
