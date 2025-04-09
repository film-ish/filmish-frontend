import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../api/review';
import { Comment } from '../../types/comment';

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

interface DeleteCocomentProps {
  cocommentsId: number;
}

const useComment = (reviewId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['review-comments', reviewId];

  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => {
      const response = await reviewService.getReviewComments(reviewId, pageParam);
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (lastPage.length === 0) return undefined;
      return lastPageParam + 1;
    },
    // staleTime: 1 * 1000,
    enabled: !!reviewId,
    placeholderData: {
      pages: [[]],
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ content, parentCommentId }: CreateCommentProps) => {
      console.log(content, parentCommentId);
      return await reviewService.createReviewComment(reviewId, content, parentCommentId);
    },
    onSuccess: (response) => {
      console.log(response);

      queryClient.invalidateQueries(queryKey);

      // queryClient.setQueryData(queryKey, (oldData: any) => {
      //   if (!oldData) return oldData;

      //   return {
      //     ...oldData,
      //     pages: [[newComment, ...oldData.pages[0]], ...oldData.pages.slice(1)],
      //   };
      // });
    },
    onError: (error) => console.error(error),
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: UpdateCommentProps) =>
      await reviewService.updateReviewComment(commentId, content),
    onSuccess: (response) => {
      console.log(response);
      console.log('성공적으로 수정 됨');

      queryClient.invalidateQueries(queryKey);

      // const updatedComment = response.data;

      // queryClient.setQueryData(queryKey, (oldData: any) => {
      //   if (!oldData) return oldData;

      //   return {
      //     ...oldData,
      //     pages: oldData.pages.map((page: any) =>
      //       page.map((comment: any) => (comment.id === updatedComment.id ? updatedComment : comment)),
      //     ),
      //   };
      // });
    },
    onError: (error) => console.error(error),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ commentId }: { commentId: number }) => {
      console.log(commentId);
      return await reviewService.deleteReviewComment(commentId);
    },
    onSuccess: (response, { commentId }) => {
      queryClient.invalidateQueries(queryKey);
      // queryClient.setQueryData(queryKey, (oldData) => {
      //   if (!oldData) return oldData;

      //   const newPages = oldData.pages.map((page: Comment[]) => {
      //     const filtered = page.filter((comment) => comment.commentId !== commentId);
      //     return filtered;
      //   });

      //   return {
      //     ...oldData,
      //     pages: [...newPages], // 💡 새 배열 보장
      //   };
      // });
    },
    onError: (error) => console.error(error),
  });

  const deleteCocommentMutation = useMutation({
    mutationFn: async ({ cocommentsId }: DeleteCocomentProps) => await reviewService.deleteReviewComment(cocommentsId),
    onSuccess: (response, { cocommentsId }) => {
      console.log(cocommentsId);
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page: Comment[]) => {
          const filtered = page.map((comment) => {
            const newCocomments = comment.cocomments?.filter((cocomment) => cocomment.cocommentsId !== cocommentsId);
            return {
              ...comment,
              cocomments: newCocomments,
            };
          });
          return filtered;
        });

        return {
          ...oldData,
          pages: [...newPages],
        };
      });
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
    deleteCocomment: deleteCocommentMutation.mutate,
  };
};

export default useComment;
