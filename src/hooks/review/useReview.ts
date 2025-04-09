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
        return null;
      }

      const newImages = [];
      response.data.images.forEach((image) => {
        newImages.push(image.path);
      });

      return { ...response.data, images: newImages };
    },
    staleTime: 0,
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

      queryClient.invalidateQueries(['movies-reviews', movieId]);
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async () => {
      const response = await reviewService.deleteReview(reviewId);
      console.log(response);
      navigate(`/movies/${movieId}/reviews`);
      return response;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(queryKey),
        queryClient.invalidateQueries(['movies-reviews', movieId]),
      ]);
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
