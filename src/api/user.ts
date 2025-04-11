import { apiClient } from './instance/client';

export const userService = {
  async validateNickname(nickname: string) {
    const { data } = apiClient.get(`/users?nickname=${nickname}`);
    return data;
  },

  async getProfile(userId: number) {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data;
  },

  async updateProfile(userId: number, nickname: string, image: File) {
    console.log(userId, nickname, image);
    const formData = new FormData();
    formData.append('nickname', nickname);

    if (image) {
      formData.append('image', image);
    }

    const { data } = await apiClient.patch(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },

  async deleteAccount(userId: number) {
    const { data } = await apiClient.delete(`/users/${userId}`);
    return data;
  },

  async getMyRatings(userId: number, page: number, size?: number = 20) {
    const { data } = await apiClient.get(`/users/${userId}/ratings?pageNum=${page}&pageSize=${size}`);
    console.log(data);
    return data;
  },

  async getMyReviewList(userId: number, page: number, size?: number = 10) {
    const { data } = await apiClient.get(`/users/${userId}/reviews?pageNum=${page}&pageSize=${size}`);
    return data;
  },

  async getMyQnaList(userId: number, page: number, size?: number = 10) {
    const { data } = await apiClient.get(`/users/${userId}/qna?pageNum=${page}&pageSize=${size}`);
    return data;
  },

  async getMyReviewCommentList(userId: number, page: number, size?: number = 10) {
    const { data } = await apiClient.get(`/users/${userId}/reviews/comments?pageNum=${page}&pageSize=${size}`);
    console.log(data);
    return data;
  },

  async getMyQnaCommentList(userId: number, page: number, size?: number = 10) {
    const { data } = await apiClient.get(`/users/${userId}/qna/comments?pageNum=${page}&pageSize=${size}`);
    return data;
  },

  async getMyLikeList(userId: number, page: number, size?: number = 10) {
    const { data } = await apiClient.get(`/users/${userId}/likes?pageNum=${page}&pageSize=${size}`);
    return data;
  },
};
