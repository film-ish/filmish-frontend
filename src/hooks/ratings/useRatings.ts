import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movieService } from '../../api/movie';

const useRatings = (movieId: number) => {
  const queryClient = useQueryClient();
  const ratingListQueryKey = ['movie-ratings', movieId];

  const ratingListQuery = useInfiniteQuery({
    queryKey: ratingListQueryKey,
    queryFn: async ({ pageParam }) => {
      const response = await movieService.getMovieRatings(movieId!, pageParam);
      console.log('response', response);

      const ratings = {
        '0.5': 0,
        '1.0': 0,
        '1.5': 0,
        '2.0': 0,
        '2.5': 0,
        '3.0': 0,
        '3.5': 0,
        '4.0': 0,
        '4.5': 0,
        '5.0': 0,
      };

      response.data.content.forEach((rate) => {
        ratings[rate.value.toFixed(1)]++;
      });

      const averageRating =
        response.data.content.reduce((acc, curr) => acc + curr.value, 0) / response.data.content.length;

      return {
        ...response.data,
        ratingsCount: ratings,
        averageRating,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (lastPage.comments?.length === 0) return undefined;
      return lastPageParam + 1;
    },
    staleTime: 1 * 1000,
    enabled: !!movieId,
    placeholderData: {
      pages: [
        {
          content: [
            {
              id: 0,
              writerName: '',
              writerImage: null,
              value: 0,
              content: '',
              createdAt: '',
              updatedAt: null,
            },
          ],
          pageable: {
            pageNumber: 0,
            pageSize: 10,
            sort: {
              sorted: false,
              unsorted: true,
              empty: true,
            },
            offset: 0,
            paged: true,
            unpaged: false,
          },
          last: true,
          totalPages: 0,
          totalElements: 0,
          first: true,
          numberOfElements: 0,
          size: 10,
          number: 0,
          sort: {
            sorted: false,
            unsorted: true,
            empty: true,
          },
          empty: true,
          averageRating: 0.0,
        },
      ],
    },
  });

  const createRatingMutation = useMutation({
    mutationFn: async ({ rating, content }: { rating: number; content?: string }) => {
      return await movieService.createMovieRating(movieId, rating, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingListQueryKey });
      queryClient.invalidateQueries({ queryKey: ['movie', movieId] });
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: async ({ ratingId, rating, content }: { ratingId: number; rating: number; content?: string }) => {
      return await movieService.updateRating(ratingId, rating, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingListQueryKey });
      queryClient.setQueryData(['movie', movieId], (oldData) => {
        if (!oldData) return oldData;

        const newAverageRating =
          oldData.ratingsCount.reduce((acc, curr) => acc + curr.value, 0) / oldData.ratingsCount.length;

        return {
          ...oldData,
          ratingsCount: oldData.ratingsCount,
          averageRating: newAverageRating,
        };
      });
    },
  });

  const deleteRatingMutation = useMutation({
    mutationFn: async (ratingId: number) => {
      return await movieService.deleteRating(ratingId);
    },
    onSuccess: () => {
      queryClient.setQueryData(ratingListQueryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              comments: page.comments.filter((comment) => comment.id !== ratingId),
            };
          }),
        };
      });

      queryClient.invalidateQueries({ queryKey: ratingListQueryKey });
    },
  });

  return {
    ratingListQuery,
    createRating: createRatingMutation.mutate,
    updateRating: updateRatingMutation.mutate,
    deleteRating: deleteRatingMutation.mutate,
    totalRatingsCount: ratingListQuery.data?.pages[0].totalElements,
    ratings: ratingListQuery.data?.pages,
  };
};

export default useRatings;
