import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link, useOutletContext } from 'react-router';
import { MoreHorizontal } from 'lucide-react';
import IconButton from '../../components/common/IconButton';
import ProfileImage from '../../components/common/ProfileImage';
import { userService } from '../../api/user';
import { useUserStore } from '../../store/userStore';
import { getTimeAgo } from '../../utils/date';

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
  const user = useUserStore();

  const qnaListQuery = useInfiniteQuery({
    queryKey: ['qna-list', user.id],
    queryFn: async ({ pageParam }) => {
      const response = await userService.getMyQnaList(user.id, pageParam, 100);
      console.log('response', response);
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (!lastPage || !lastPage.content || lastPage.content.length === 0) return undefined;
      return lastPage.nextPage;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: user.id === 0 || !!user.id,
    placeholderData: {
      pages: [
        {
          content: [],
          nextPage: 0,
        },
      ],
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-white">Q&A</h1>
      <div className="grid grid-cols-1 gap-6">
        {qnaListQuery.data?.pages.map((page) => {
          return page.content?.map((qna) => {
            return (
              <Link
                to={`/movie-talk/${qna.makerId}`}
                key={qna.qnaId}
                className="flex flex-col gap-4 p-4 bg-gray-6 rounded-lg hover:bg-gray-5/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="text-white font-medium">
                      <span className="font-bold">{qna.makerName}</span> 님에게
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-gray-400">{qna.content}</p>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>{getTimeAgo(qna.updatedAt || qna.createdAt)}</span>
                      <div className="flex gap-4">
                        <span>답변 {qna.comments.length}</span>
                        <span>제작자 {qna.makerName}</span>
                      </div>
                    </div>
                  </div>

                  {/* <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                    }}>
                    <MoreHorizontal size={20} className="text-gray-400" />
                  </IconButton> */}
                </div>
              </Link>
            );
          });
        })}
      </div>
    </div>
  );
};

export default QnaPage;
