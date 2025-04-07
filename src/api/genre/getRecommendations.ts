// api/genre/getRecommendations.ts
import { apiClient } from '../instance/client';

// 추천 영화 목록을 가져오는 API 함수
const getRecommendations = async (num = 10) => {
    const response = await apiClient.get(`/recommendation?num=${num}`);
    return response.data.data.recommendations;
};

export { getRecommendations };