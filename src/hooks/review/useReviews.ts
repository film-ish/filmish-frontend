import { useInfiniteQuery } from '@tanstack/react-query';
import { reviewService } from '../../api/review';

const useReviews = (movieId: string) => {
  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    enabled: !!movieId,
    queryKey: ['movies-reviews', movieId],
    queryFn: async ({ pageParam }) => {
      const response = await reviewService.getReviewList(movieId, pageParam, 100);

      console.log(response);

      const newResponse = response.data.content.map((reivew) => {
        if (reivew.images.length === 0) return reivew;

        const newImages = reivew.images.map((image) => image.path);
        return { ...reivew, images: newImages };
      });

      return newResponse;
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
