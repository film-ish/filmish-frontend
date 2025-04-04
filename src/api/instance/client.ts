import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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

      try {
        const { setAccessToken } = useAuthStore();

        const { headers } = await axiosInstance.post('/users/reissue');
        const newAccessToken = headers.access;

        setAccessToken(newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenStorage.remove();
        throw refreshError;
      }
    }

    return Promise.reject(error);
  },
);
