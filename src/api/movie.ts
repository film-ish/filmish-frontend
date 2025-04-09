import { apiClient } from './instance/client';

export const movieService = {
  async getMovieDetail(movieId: number) {
    const { data } = await apiClient.get(`/movies/${movieId}`);
    return data;
  },

  async createMovieRating(movieId: string, rating: number, content?: string) {
    console.log(movieId, rating, content);

    const formData = new FormData();

    formData.append('indieId', movieId);
    formData.append('value', rating);
    formData.append('content', content?.trimEnd() || '');

    const { data } = await apiClient.post(`/rates`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(data);

    return data;
  },

  async deleteRating(ratingId: number) {
    const { data } = await apiClient.delete(`/rates/${ratingId}`);
    console.log('data', data);
    return data;
  },

  async updateRating(ratingId: number, rating: number, content?: string) {
    const { data } = await apiClient.put(`/rates/${ratingId}`, {
      value: rating,
      content,
    });
    return data;
  },

  async getMovieRatings(movieId: number, page: number, size?: number = 100) {
    const { data } = await apiClient.get(`/movies/${movieId}/ratings?page=${page}&size=${size}`);
    return data;
  },

  async likeMovie(movieId: number, like: boolean) {
    if (like) {
      const { data } = await apiClient.post(`/movies/likes`, {
        indieId: movieId,
      });

      console.log('data', data);

      return data;
    } else {
      const { data } = await apiClient.delete(`/movies/likes/${movieId}`);

      console.log('data', data);

      return data;
    }
  },
};
