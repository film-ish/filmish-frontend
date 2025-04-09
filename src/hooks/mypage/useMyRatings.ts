import { useInfiniteQuery } from '@tanstack/react-query';
import { userService } from '../../api/user';

const useMyRatings = (userId: number) => {
  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['my-ratings', userId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await userService.getMyRatings(userId, pageParam);
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextPage;
    },
    enabled: userId === 0 || !!userId,
  });

  return {
    ratings: data,
    isLoading,
  };
};

export default useMyRatings;
