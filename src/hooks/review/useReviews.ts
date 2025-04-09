import { useInfiniteQuery } from '@tanstack/react-query';
import { reviewService } from '../../api/review';

const useReviews = (movieId: string) => {
  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    enabled: !!movieId,
    queryKey: ['movies-reviews', movieId],
    queryFn: async ({ pageParam }) => {
      const response = await reviewService.getReviewList(movieId, pageParam);
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (lastPage.length === 0) return undefined;
      return lastPageParam + 1;
    },
    staleTime: 1 * 1000,
    placeholderData: {
      pages: [[]],
    },
  });

  return {
    reviews: data,
    isLoading,
    getMoreReviews: fetchNextPage,
  };
};

export default useReviews;
