import { useInfiniteQuery } from '@tanstack/react-query';
import { useUserStore } from '../../store/userStore';
import { userService } from '../../api/user';
import { getTimeAgo } from '../../utils/date';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '../../components/common/ProfileImage';

interface SubComment {
  id: number;
  writer: string;
  writerImage: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  subComments: SubComment[] | null;
}

interface Comment {
  id: number;
  writer: string;
  writerImage: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  subComments: SubComment[];
}

interface QnaPost {
  qnaId: number;
  title: string;
  writer: string;
  writerImage: string | null;
  createdAt: string;
  updatedAt: string | null;
  content: string;
  comments: Comment[];
}

const QnaCommentsPage = () => {
  const user = useUserStore();
  const navigate = useNavigate();

  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['my-qna-comment-list', user.id],
    queryFn: async ({ pageParam }) => {
      const response = await userService.getMyQnaCommentList(user.id, pageParam);
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
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-white">내가 댓글을 남긴 Q&A</h1>

      {isLoading && <div className="w-full h-full flex items-center justify-center">로딩 중..</div>}

      <div className="w-full h-[1px] bg-gray-6" />

      <div className="flex flex-col gap-4">
        {data?.pages?.map((page) => {
          return page?.content?.map((post: QnaPost) => (
            <div
              key={post.qnaId}
              className="flex flex-col gap-2 bg-gray-6 rounded-lg p-4 cursor-pointer hover:bg-gray-5 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-6 overflow-hidden">
                  <ProfileImage src={post.writerImage} size={40} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium">{post.writer}</span>
                  <span className="text-sm text-gray-400">{getTimeAgo(post.createdAt)}</span>
                </div>
              </div>
              <h2 className="text-lg text-white font-medium">{post.title}</h2>
              <p className="text-gray-300 line-clamp-2">{post.content}</p>
            </div>
          ));
        })}
      </div>
    </div>
  );
};

export default QnaCommentsPage;
