import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router';
import { MoreHorizontal } from 'lucide-react';
import IconButton from '../../components/common/IconButton';
import ProfileImage from '../../components/common/ProfileImage';
import { userService } from '../../api/user';

interface Cocomment {
  cocomentId: number;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  cocoments: Cocomment[];
}

interface QnA {
  qnaId: number;
  title: string;
  content: string;
  writer: string;
  writerImage: string;
  createdAt: string;
  updatedAt: string;
  makerId: number;
  makerName: string;
  comments: Comment[];
}

const QnaPage = () => {
  const { user } = useOutletContext();

  const qnaListQuery = useInfiniteQuery({
    queryKey: ['qna-list', user.userId],
    queryFn: async ({ pageParam }) => {
      const response = await userService.getMyQnaList(user.userId, pageParam);
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
    enabled: user.userId === 0 || !!user.userId,
    placeholderData: {
      pages: [
        {
          qna: [],
        },
      ],
    },
  });

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-8">Q&A</h1>
      <div className="grid grid-cols-1 gap-6">
        {qnaListQuery.data?.pages.map((page) =>
          page.qna.map((qna) => (
            <div
              key={qna.qnaId}
              className="flex flex-col gap-4 p-4 bg-gray-7 rounded-lg hover:bg-gray-6 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-4">
                  <div className="text-white font-medium">
                    <span className="font-bold">{qna.makerName}</span> 님에게
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl text-white font-bold">{qna.title}</h3>
                    <p className="text-gray-400">{qna.content}</p>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>{new Date(qna.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-4">
                      <span>답변 {qna.comments.length}</span>
                      <span>제작자 {qna.makerName}</span>
                    </div>
                  </div>
                </div>
                <IconButton onClick={() => {}}>
                  <MoreHorizontal size={20} className="text-gray-400" />
                </IconButton>
              </div>
            </div>
          )),
        )}
      </div>
    </>
  );
};

export default QnaPage;
