import { apiClient } from '../instance/client';

// 상업 영화 목록을 가져오는 API 함수
const getCommercialMovies = async () => {
    const response = await apiClient.get('/movies/like-commercial');
    return response.data;
};

// 좋아요한 상업 영화 목록 가져오기
const getLikedCommercialMovies = async () => {
    const response = await apiClient.get('/movies/liked-commercial');
    return response.data;
};

// 좋아요 상업 영화 목록 한번에 보내기
const submitLikedCommercialMovies = async (commercialIds: number[]) => {
    const response = await apiClient.post('/movies/like-commercial', {
        commercialId: commercialIds
    });
    return response.data;
};

export {
    getCommercialMovies,
    getLikedCommercialMovies,
    submitLikedCommercialMovies
};