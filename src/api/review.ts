import { apiClient } from './instance/client';

export const reviewService = {
  async createReview(movieId, title, content, images?: File[]) {
    const formData = new FormData();
    formData.append('indieId', movieId);
    formData.append('title', title);
    formData.append('content', content);

    if (images) {
      formData.append('image', images);
    }

    const { data } = await apiClient.post('/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },

  async getReviewDetail(reviewId: string) {
    const { data } = await apiClient.get(`/reviews/${reviewId}`);

    return data;
  },

  async updateReview(reviewId: string, title: string, content: string) {
    const { data } = await apiClient.put(`/reviews/${reviewId}`, {
      title,
      content,
    });

    return data;
  },

  async deleteReview(reviewId: number) {
    const { data } = apiClient.delete(`/reviews/${reviewId}`);
    return data;
  },

  async getReviewList(movieId: string, page: number, size?: number = 10) {
    const response = await apiClient.get(`/movies/${movieId}/reviews?page=${page}&size=${size}`);

    // if (page === 3) return [];

    // const response = {
    //   code: '200',
    //   message: '영화 리뷰 목록 조회가 완료되었습니다.',
    //   data: [
    //     {
    //       reviewId: page === 1 ? 251 : 255,
    //       writerName: page === 1 ? '참기름 넣은 비빔밥 1p' : '참기름 넣은 비빔밥 2p',
    //       writerImage: '',
    //       title: '리뷰 제목',
    //       content:
    //         '귀울음 바이러스가 장악한 세상, 그 안에 살고 있는 진희는 감염자를 쫓는 일을 하는 감염자이다. 감염자이지만 감염자를 쫓아야만 하는 딜레마를 부여해놓고 시작하는 영화는 동료 희경의 감염사실을 알게 됨과 동시에 자신의 감염을 들키며 긴장과 불안을 증폭시키고, 그 증폭된 영화적 분위기에서 희경의 딸을 구해야만 하는 의무를 스스로 떠안게 되며 더욱 그 긴장감은 극에 달한다. 영화 속에 바이러스가 불러오는 딜레마적 사회를 구현해 놓고 그 안에 긴장과 불안을 밀도 있게 쌓아 올리는 <귀울음>에서 우리가 경험했던 혹은 여전히 경험하는 세상을 다시 한번 돌이켜보고, 어쩌면 우리에게서 조금은 섬뜩함도 느껴본다.',
    //       image: 'https://picsum.photos/seed/251/800/1200',
    //       createdAt: '2024-05-10',
    //       updatedAt: '2025-01-10',
    //       views: 29,
    //     },
    //     {
    //       reviewId: page === 1 ? 214 : 256,
    //       writerName: page === 1 ? '참기름 넣은 비빔밥 1p' : '참기름 넣은 비빔밥 2p',
    //       writerImage: '',
    //       title: '리뷰 제목',
    //       content: '리뷰 내용',
    //       image: 'https://picsum.photos/seed/214/300/100',
    //       createdAt: '2024-05-10',
    //       updatedAt: '2025-01-10',
    //       views: 100,
    //     },
    //     {
    //       reviewId: page === 1 ? 215 : 257,
    //       writerName: page === 1 ? '참기름 넣은 비빔밥 1p' : '참기름 넣은 비빔밥 2p',
    //       writerImage: '',
    //       title: '참 재밌는 영화',
    //       content: '증말 재밌어요!',
    //       image: '',
    //       createdAt: '2024-05-10',
    //       updatedAt: '2025-01-10',
    //       views: 100,
    //     },
    //   ],
    // };

    return response.data.data.content;
  },

  async getReviewComments(reviewId: string, page: number, size?: number = 10) {
    const { data } = await apiClient.get(`/reviews/${reviewId}/comments?page=${page}&size=${size}`);

    // const response = {
    //   code: '200',
    //   message: '코멘트 조회가 완료되었습니다',
    //   data: {
    //     comments: [
    //       {
    //         commentId: 2,
    //         commentWriterName: '발레하는 토끼',
    //         commentWriterImage: '',
    //         commentWriterType: 'USER',
    //         content: '너무 재밌어요.',
    //         cocomments: [
    //           {
    //             cocommentsId: 18,
    //             cocommentWriterName: '장보는 악어',
    //             cocommentWriterImage: '',
    //             commentWriterType: 'USER',
    //             content: '공감합니다.',
    //           },
    //           {
    //             cocommentsId: 19,
    //             cocommentWriterName: '넥타이 맨 곰돌이',
    //             cocommentWriterImage: '',
    //             commentWriterType: 'USER',
    //             content: '2222',
    //           },
    //         ],
    //       },
    //       {
    //         commentId: 3,
    //         commentWriterName: '잠자는 고양이',
    //         commentWriterImage: '',
    //         commentWriterType: 'USER',
    //         content:
    //           'sf단편 영역에서 공들인 미술을 통해 간극을 줄이는 작품은 시각적으로 설득력을 갖는다는 점에서 적잖은 매력을 보여준다. 물론 미술에 대한 맹목적인 집중 때문에 서사와 같은 기본적인 요소마저 전부 미술에 의지하는 경우를 심심찮게 발견할 수 있다. 반면 그런 측면에서 미술의 공이 상당해보이는 <귀울음>의 서사와 설정은 이에 매몰되지 않는 힘을 가지며 작품을 함께 이끌어간다는 점이 흥미롭다.',
    //         comments: [],
    //       },
    //     ],
    //   },
    // };

    return data;
  },
  async createReviewComment(reviewId: number, content: string, parentId?: number) {
    const { data } = await apiClient.post(`/reviews/comments`, {
      reviewId,
      content,
      parentId,
    });

    return data;
  },
  async deleteReviewComment(commentId: number) {
    const { data } = await apiClient.delete(`/reviews/comments/${commentId}`);
    return data;
  },
  async updateReviewComment(commentId: string, content: string) {
    // const { data } = await apiClient.put(`/reviews/comments/${commentId}`, content);

    console.log(commentId, content);

    const data = {
      code: '200',
      message: '코멘트 수정이 완료되었습니다',
    };

    return data;
  },
};
