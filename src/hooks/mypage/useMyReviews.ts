import { useInfiniteQuery } from '@tanstack/react-query';
import { userService } from '../../api/user';

const useMyReviews = (userId: number) => {
  const { data } = useInfiniteQuery({
    queryKey: ['my-reviews', userId],
    queryFn: async ({ pageParam }) => {
      const response = await userService.getMyReviewList(userId, pageParam);
      console.log(response);
      return response.data;
    },
    select: (data) => ({
      pages: data.pages,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPageParam + 1;
    },
    staleTime: 1 * 1000,
    enabled: userId === 0 || !!userId,
    placeholderData: {
      pages: [
        {
          reviews: [],
        },
      ],
    },
  });

  return { data };
};

export default useMyReviews;
