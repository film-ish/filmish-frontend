import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movieService } from '../../api/movie';
import { useState } from 'react';

const useRatings = (movieId: number) => {
  const queryClient = useQueryClient();
  const ratingListQueryKey = ['movie-ratings', movieId];

  const [currentFormData, setCurrentFormData] = useState<CommentFormData | null>(null);

  const ratingListQuery = useInfiniteQuery({
    queryKey: ratingListQueryKey,
    queryFn: async ({ pageParam }) => {
      const response = await movieService.getMovieRatings(movieId!, pageParam);

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

      const formData = currentFormData;

      if (!formData) return;

      queryClient.setQueryData(ratingListQueryKey, (oldData) => {
        if (!oldData) return oldData;
        // 새 댓글 추가 시 새로운 댓글 객체 생성
        // ID는 서버에서 생성되지만 여기서는 임시 ID를 사용
        const newComment: Comment = {
          id: `temp-${Date.now()}`, // 임시 ID
          movieId: formData.movieId,
          writerName: formData.writerName,
          writerImage: formData.writerImage,
          content: formData.content,
          value: formData.value,
          createdAt: formData.createdAt,
          updatedAt: formData.updatedAt,
        };

        // 추가 로직: 첫 번째 페이지에 댓글 추가
        const updatedFirstPage = {
          ...firstPageData,
          totalCounts: firstPageData.totalCounts + 1,
          comments: [newComment, ...firstPageData.comments],
          ratings: {
            ...firstPageData.ratings,
            [formData.value]: (firstPageData.ratings[formData.value] || 0) + 1,
          },
          avgScore:
            (firstPageData.avgScore * firstPageData.totalCounts + formData.value) / (firstPageData.totalCounts + 1),
        };

        queryClient.invalidateQueries({ queryKey: ratingListQueryKey });

        return {
          ...oldData,
          pages: [updatedFirstPage, ...oldData.pages.slice(1)],
        };
      });

      setIsEditing(false);
      setCurrentFormData(null); // 작업 완료 후 상태 초기화
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: async ({ ratingId, rating, content }: { ratingId: number; rating: number; content?: string }) => {
      return await movieService.updateRating(ratingId, rating, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingListQueryKey });

      // const formData = currentFormData;

      // if (!formData) return;

      // queryClient.setQueryData(ratingListQueryKey, (oldData) => {
      //   if (!oldData) return oldData;

      //   // 첫 번째 페이지 데이터 복사
      //   const firstPageData = { ...oldData.pages[0] };

      //   // 수정 시 새로운 댓글 객체 생성
      //   const updatedComment: Comment = {
      //     ...myRating,
      //     content: formData.content,
      //     value: formData.value,
      //     updatedAt: formData.updatedAt,
      //   };

      //   // 수정 로직: 각 페이지를 순회하여 댓글 업데이트
      //   const updatedPages = oldData.pages.map((page) => {
      //     const updatedComments = page.comments.map((comment) =>
      //       comment.id === myRating.id ? updatedComment : comment,
      //     );

      //     return {
      //       ...page,
      //       comments: updatedComments,
      //     };
      //   });

      //   // 평균 점수 업데이트
      //   const ratingDiff = formData.value - myRating.value;
      //   const newAvgScore = firstPageData.avgScore + ratingDiff / firstPageData.totalCounts;

      //   // ratings 객체 업데이트
      //   const updatedRatings = { ...firstPageData.ratings };
      //   updatedRatings[myRating.value] = Math.max(0, (updatedRatings[myRating.value] || 0) - 1);
      //   updatedRatings[formData.value] = (updatedRatings[formData.value] || 0) + 1;

      //   // 첫 번째 페이지 데이터 업데이트
      //   updatedPages[0] = {
      //     ...updatedPages[0],
      //     avgScore: newAvgScore,
      //     ratings: updatedRatings,
      //   };

      //   return {
      //     ...oldData,
      //     pages: updatedPages,
      //   };
      // });

      // setIsEditing(false);
      // setCurrentFormData(null); // 작업 완료 후 상태 초기화
    },
  });

  return {
    ratingListQuery,
    createRating: createRatingMutation.mutate,
    updateRating: updateRatingMutation.mutate,
    totalRatingsCount: ratingListQuery.data?.pages[0].totalElements,
    ratings: ratingListQuery.data?.pages,
  };
};

export default useRatings;
