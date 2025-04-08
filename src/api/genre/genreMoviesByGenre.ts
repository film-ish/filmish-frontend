import {apiClient} from "../instance/client.ts";

const getMoviesByGenre = async (genreId: number, pageNum: number = 0, pageSize: number = 24) => {
    const response = await apiClient.get(`/movies/genre/${genreId}?page=${pageNum}&size=${pageSize}`);
    // const response = await apiClient.get(`/movies/genre/${genreId}`);
    return response.data;
};

export {getMoviesByGenre};
