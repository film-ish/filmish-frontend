import { apiClient } from './instance/client';

export const reviewService = {
  async createReview(movieId: number, title: string, content: string, images?: File[]) {
    const formData = new FormData();
    formData.append('indieId', movieId);
    formData.append('title', title);
    formData.append('content', content);

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    const response = await apiClient.post('/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response);

    return response.data;
  },

  async getReviewDetail(reviewId: string) {
    const { data } = await apiClient.get(`/reviews/${reviewId}`);

    console.log('data', data);

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
    const { data } = await apiClient.delete(`/reviews/${reviewId}`);
    return data;
  },

  async getReviewList(movieId: string, page: number, size?: number = 10) {
    const { data } = await apiClient.get(`/movies/${movieId}/reviews?page=${page}&size=${size}`);
    return data;
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
  async updateReviewComment(commentId: number, content: string) {
    const { data } = await apiClient.put(`/reviews/comments/${commentId}`, { content });

    return data;
  },
};
