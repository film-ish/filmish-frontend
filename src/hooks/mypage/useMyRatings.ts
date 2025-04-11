import { useInfiniteQuery } from '@tanstack/react-query';
import { userService } from '../../api/user';

const useMyRatings = (userId: number) => {
  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['my-ratings', userId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await userService.getMyRatings(userId, pageParam, 100);
      console.log(response);
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || !lastPage.content || lastPage.content.length === 0) return undefined;
      return lastPage.nextPage;
    },
    enabled: userId === 0 || !!userId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    placeholderData: {
      pages: [
        {
          content: [],
          nextPage: 0,
        },
      ],
    },
  });

  return {
    ratings: data,
    isLoading,
  };
};

export default useMyRatings;
