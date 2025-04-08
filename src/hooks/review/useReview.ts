import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../api/review';

const useReview = (movieId: number, reviewId: number, navigate?: NavigateFunction) => {
  const queryClient = useQueryClient();
  const queryKey = ['review', movieId, reviewId];

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await reviewService.getReviewDetail(reviewId);

      if (response.code === 'NOT_FOUND') {
        alert('존재하지 않는 리뷰입니다.');
        navigate(`/movies/${movieId}/reviews`);
      }

      const newImages = [];
      response.data.images.forEach((image) => {
        newImages.push(image.path);
      });

      return { ...response.data, images: newImages };
    },
    retry: false,
    enabled: !!movieId && !!reviewId,
    placeholderData: {
      id: 0,
      title: '',
      content: '',
      writerName: '',
      writerImage: '',
      createdAt: '',
      updatedAt: null,
      views: 0,
      images: [],
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async ({ title, content, images }: { title: string; content: string; images?: File[] }) => {
      const response = await reviewService.createReview(movieId, title, content, images);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      // queryClient.setQueryData(queryKey, (oldData) => {
      //   return [...oldData, response.data];
      // });
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      const response = await reviewService.updateReview(reviewId, title, content);
      return response;
    },
    onSuccess: (response, { title, content }) => {
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          title,
          content,
        };
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async () => {
      if (confirm('정말 삭제하시겠습니까?')) {
        const response = await reviewService.deleteReview(reviewId);
        return response;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      navigate(`/movies/${movieId}/reviews`);
    },
  });

  return {
    review: data,
    createReview: createReviewMutation.mutate,
    updateReview: updateReviewMutation.mutate,
    deleteReview: deleteReviewMutation.mutate,
  };
};

export default useReview;
