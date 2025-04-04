import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.access = accessToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { setAccessToken } = useAuthStore.getState();

      try {
        const { headers } = await apiClient.post('/users/reissue');
        const newAccessToken = headers.access;

        setAccessToken(newAccessToken);

        originalRequest.headers.access = newAccessToken;

        return apiClient(originalRequest);
      } catch (error) {
        setAccessToken("");
        throw error;
      }
    }
    return Promise.reject(error);
  },
);
