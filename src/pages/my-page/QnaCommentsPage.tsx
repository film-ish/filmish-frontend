import { useInfiniteQuery } from '@tanstack/react-query';
import { useUserStore } from '../../store/userStore';
import { userService } from '../../api/user';

const QnaCommentsPage = () => {
  const user = useUserStore();

  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['my-qna-comment-list', user.id],
    queryFn: async ({ pageParam }) => {
      const response = await userService.getMyQnaCommentList(user.id, pageParam);
      console.log(response);
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPageParam + 1;
    },
    staleTime: 1 * 1000,
    enabled: user.id === 0 || !!user.id,
    placeholderData: {
      pages: [{}],
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-white">내가 댓글을 남긴 Q&A</h1>

      {isLoading && <div className="w-full h-full flex items-center justify-center">로딩 중..</div>}

      <div className="w-full h-[1px] bg-gray-6" />

      {data?.pages?.map((page) => {
        console.log(page);
        return page?.content?.map((review, index) => {
          console.log(review);
          return <div>{index}</div>;
        });
      })}
    </div>
  );
};

export default QnaCommentsPage;
