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
    return data;
  },

  async getMyReviewList(userId: number, page: number, size?: number = 10) {
    // const { data } = await apiClient.get(`/users/${userId}/reviews?page=${page}&size=${size}`);

    const data = {
      code: '200',
      message: '조회가 완료되었습니다.',
      data: {
        reviews: [
          {
            img: 'http://file.koreafilm.or.kr/still/copy/00/50/10/DSKT302307_01.jpg',
            views: 19,
            movieId: 1,
            reviewId: 1,
            title: '귀울을 바이러스가 장악한 세상',
            movieTitle: '영화제목',
            content:
              '귀울을 바이러스가 장악한 세상, 그 안에 살고 있는 진화는 감염자를 찾는 일을 하는 감염자이다. 감염자이지만 감염자를 찾아야만 하는 모순된 상황에서 자신의 감정을 통제하며 살아가던 중...',
            createdAt: '2024-09-01',
            updatedAt: '2025-09-01',
          },
          {
            img: 'http://file.koreafilm.or.kr/still/copy/00/50/10/DSKT302307_01.jpg',
            views: 19,
            movieId: 1,
            reviewId: 2,
            title: '귀울을 바이러스가 장악한 세상',
            movieTitle: '영화제목',
            content:
              '귀울을 바이러스가 장악한 세상, 그 안에 살고 있는 진화는 감염자를 찾는 일을 하는 감염자이다. 감염자이지만 감염자를 찾아야만 하는 모순된 상황에서 자신의 감정을 통제하며 살아가던 중...',
            createdAt: '2024-09-01',
            updatedAt: '2025-09-01',
          },
          {
            views: 19,
            movieId: 1,
            reviewId: 3,
            title: '귀울을 바이러스가 장악한 세상',
            movieTitle: '영화제목',
            content:
              '귀울을 바이러스가 장악한 세상, 그 안에 살고 있는 진화는 감염자를 찾는 일을 하는 감염자이다. 감염자이지만 감염자를 찾아야만 하는 모순된 상황에서 자신의 감정을 통제하며 살아가던 중...',
            createdAt: '2024-09-01',
            updatedAt: '2025-09-01',
          },
        ],
      },
    };

    return data;
  },

  async getMyQnaList(userId: string, page: number, size?: number = 10) {
    // const { data } = await apiClient.get(`/users/${userId}/qna?page=${page}&size=${size}`);

    const data = {
      code: '200',
      data: {
        qna: [
          {
            qnaId: 1,
            title: '제목',
            content: '오늘의 내용',
            writer: '맥북 산 유민',
            writerImage: '이미지',
            createdAt: '2023-01-01',
            updatedAt: '2025-03-12',
            makerId: 2946,
            makerName: '우성윤',
            comments: [
              {
                commentId: 205,
                content: '내용',
                createdAt: '2024-12-15',
                updatedAt: null,
                cocoments: [],
              },
              {
                commentId: 205,
                content: '내용',
                createdAt: '2024-12-15',
                updatedAt: null,
                cocoments: [
                  {
                    cocomentId: 13,
                    content: '내용',
                    createdAt: '2024-12-15',
                    updatedAt: '2025-01-04',
                  },
                ],
              },
            ],
          },
          {
            qnaId: 2,
            title: '제목',
            content: '오늘의 내용',
            writer: '맥북 산 유민',
            writerImage: '이미지',
            createdAt: '2023-01-01',
            updatedAt: '2025-03-12',
            makerId: 2946,
            makerName: '우성윤',
            comments: [],
          },
        ],
      },
    };

    return data;
  },
};
