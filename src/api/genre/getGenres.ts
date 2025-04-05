// api/genre/genreApi.ts
import {apiClient} from '../instance/client';

// 장르 목록을 가져오는 API 함수
const getGenres = async () => {
    const response = await apiClient.get('/recommendation/genres?pageNum=0&pageSize=10');
    return response.data.data.content;
};

export {getGenres};