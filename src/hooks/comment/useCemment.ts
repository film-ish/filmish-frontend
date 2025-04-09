import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../api/review';

interface CreateCommentProps {
  content: string;
  parentCommentId?: number;
}

interface UpdateCommentProps {
  commentId: number;
  content: string;
}

interface DeleteCommentProps {
  commentId: number;
}

const useComment = (reviewId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['review-comments', reviewId];

  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => {
      const response = await reviewService.getReviewComments(reviewId, pageParam);
      console.log(response);
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return lastPageParam + 1;
    },
    staleTime: 1 * 1000,
    enabled: !!reviewId,
    placeholderData: {
      pages: [[]],
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ content, parentCommentId }: CreateCommentProps) => {
      const response = await reviewService.createReviewComment(reviewId, content, parentCommentId);
      return response;
    },
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => console.error(error),
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: UpdateCommentProps) => {
      const response = await reviewService.updateReviewComment(commentId, content);
      console.log(response);
      return response;
    },
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => console.error(error),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ commentId }: DeleteCommentProps) => {
      console.log(commentId);
      return await reviewService.deleteReviewComment(commentId);
    },
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => console.error(error),
  });

  return {
    comments: data,
    isLoading,
    getMoreComments: fetchNextPage,
    createComment: createCommentMutation.mutate,
    updateComment: updateCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
  };
};

export default useComment;
