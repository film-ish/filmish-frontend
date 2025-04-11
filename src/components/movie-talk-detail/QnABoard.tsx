import React, { useState } from 'react';
import QnaItem from './QnaItem';
import QnaPostInput from './QnaPostInput';
import { createQna, listQna, createComment, createReply, deleteComment, updateComment } from '../../api/actor/getQna';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

interface SubComment {
  id: number;
  writer: string;
  writerImage: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  isDeleted?: boolean;
}

interface Comment {
  id: number;
  writer: string;
  writerImage: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  subComments?: SubComment[];
  isDeleted?: boolean;
}

interface QnaItemType {
  qnaId: number;
  title: string;
  writer: string;
  writerImage: string | null;
  createdAt: string;
  updatedAt: string | null;
  content: string;
  comments?: Comment[];
}

interface QnABoardProps {
  makerId: number;
  actorName: string;
}

// 페이지네이션 데이터 인터페이스
interface QnaData {
  items: QnaItemType[];
  totalPages: number;
}

// 페이지당 항목 수
const PAGE_SIZE = 20;

const QnABoard = ({ makerId, actorName }: QnABoardProps) => {
  const [showQnaForm, setShowQnaForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 0부터 시작하는 페이지 번호
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const queryClient = useQueryClient();
  const user = useUserStore.getState();
  const [newCommentId, setNewCommentId] = useState<number | null>(null);
  const [newCommentQnaId, setNewCommentQnaId] = useState<number | null>(null);

  // QnA 목록 가져오기 (페이지네이션 적용)
  const {
    data: qnaData,
    isLoading,
    error,
  } = useQuery<QnaData>({
    queryKey: ['qnaList', makerId, currentPage],
    queryFn: async () => {
      const response = await listQna(makerId, currentPage, PAGE_SIZE);

      // 응답이 배열인 경우 처리
      if (Array.isArray(response)) {
        // 현재 로그인한 사용자 정보 가져오기
        const user = useUserStore.getState();

        // API 응답 데이터를 최소한으로 가공
        const processedItems = response.map((item) => {
          const isCurrentUser = user.isLoggedIn && user.nickname === item.writer;

          // 댓글/답글에 isDeleted 속성 추가 (API 응답 기반)
          const commentsWithDeletedFlag = (item.comments || []).map((comment: Comment) => ({
            ...comment,
            isDeleted: comment.isDeleted || comment.content === '삭제된 댓글입니다.',
            subComments: (comment.subComments || []).map((subComment: SubComment) => ({
              ...subComment,
              isDeleted: subComment.isDeleted || subComment.content === '삭제된 댓글입니다.',
            })),
          }));

          return {
            ...item,
            writerId: isCurrentUser ? user.id : undefined, // 필요한 경우 유지
            userId: isCurrentUser ? user.id : undefined, // 필요한 경우 유지
            comments: commentsWithDeletedFlag,
          };
        });

        // 페이지네이션을 위한 전체 페이지 수 계산 (이 부분은 API 응답 구조에 따라 조정 필요)
        // 만약 API 응답 자체에 totalPages 정보가 있다면 그것을 사용해야 합니다.
        const totalPages = response.length > 0 ? Math.ceil(response.length / PAGE_SIZE) : 1; // 임시 계산

        return {
          items: processedItems,
          // totalPages: response.totalPages || 1 // API 응답에 totalPages가 있다면 이렇게 사용
          totalPages: totalPages,
        };
      }

      // 응답이 객체이거나 다른 형식인 경우 처리 (필요시 추가)
      // 예: API가 { items: [], totalPages: 5 } 와 같은 형태로 응답하는 경우
      if (typeof response === 'object' && response !== null && 'items' in response && 'totalPages' in response) {
        // 객체 형태 응답 처리 로직 추가
        return {
          items: (response.items || []).map((item: any) => ({
            // 타입 정의 필요
            ...item,
            // 필요한 가공 추가
            comments: (item.comments || []).map((comment: Comment) => ({
              ...comment,
              isDeleted: comment.isDeleted || comment.content === '삭제된 댓글입니다.',
              subComments: (comment.subComments || []).map((subComment: SubComment) => ({
                ...subComment,
                isDeleted: subComment.isDeleted || subComment.content === '삭제된 댓글입니다.',
              })),
            })),
          })),
          totalPages: response.totalPages || 1,
        };
      }

      // 기본값 또는 에러 처리
      return {
        items: [],
        totalPages: 1,
      };
    },
    placeholderData: (previousData) => previousData || { items: [], totalPages: 1 },
  });

  // QnA 생성 mutation
  const createQnaMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      return await createQna(makerId, title, content);
    },
    onSuccess: (data) => {
      setShowQnaForm(false);

      // QnA 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['qnaList', makerId] });

      // 새 게시글이 추가되면 첫 페이지로 이동
      setCurrentPage(0);
    },
    onError: (error) => {
      console.error('QnA 추가에 실패했습니다:', error);
    },
  });

  // 댓글 수정 mutation
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      console.log('댓글 수정 요청:', { commentId, content });
      const response = await updateComment(commentId, content);
      console.log('댓글 수정 응답:', response);
      return { commentId, content, response };
    },
    onSuccess: (data) => {
      // 서버 응답 후 UI 업데이트
      queryClient.setQueryData(['qnaList', makerId, currentPage], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          items: oldData.items.map((qna: any) => {
            if (!qna.comments) return qna;

            return {
              ...qna,
              comments: qna.comments.map((comment: Comment) => {
                // 답글 수정 처리
                if (comment.subComments && comment.subComments.length > 0) {
                  const replyIndex = comment.subComments.findIndex((reply) => reply.id === data.commentId);
                  if (replyIndex !== -1) {
                    const updatedSubComments = [...comment.subComments];
                    updatedSubComments[replyIndex] = {
                      ...updatedSubComments[replyIndex],
                      content: data.content,
                      updatedAt: new Date().toISOString(), // 현재 시간으로 updatedAt 업데이트
                    };
                    return { ...comment, subComments: updatedSubComments };
                  }
                }

                // 댓글 수정 처리 (답글이 아닌 경우에만)
                if (comment.id === data.commentId) {
                  return {
                    ...comment,
                    content: data.content,
                    updatedAt: new Date().toISOString(), // 현재 시간으로 updatedAt 업데이트
                  };
                }

                return comment;
              }),
            };
          }),
        };
      });
    },
    onError: (error) => {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정 중 오류가 발생했습니다.');
    },
  });

  // 댓글 삭제 mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await deleteComment(commentId);
      return { commentId, response };
    },
    onMutate: async (commentId: number) => {
      console.log('삭제 mutation 시작:', commentId);
      // 이전 데이터 백업
      const previousData = queryClient.getQueryData(['qnaList', makerId, currentPage]);

      // 낙관적 업데이트: 삭제된 항목 필터링
      queryClient.setQueryData(['qnaList', makerId, currentPage], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          items: oldData.items.map((qna: any) => {
            if (!qna.comments) return qna;

            return {
              ...qna,
              comments: qna.comments
                .map((comment: Comment) => {
                  // 답글 삭제 처리: 해당 답글을 subComments 배열에서 제거
                  if (comment.subComments && comment.subComments.length > 0) {
                    const updatedSubComments = comment.subComments.filter((reply) => reply.id !== commentId);
                    // 답글이 변경되었으면 새로운 댓글 객체 반환
                    if (updatedSubComments.length !== comment.subComments.length) {
                      console.log('답글 삭제 처리 (필터링):', { commentId: comment.id, removingReplyId: commentId });
                      return { ...comment, subComments: updatedSubComments };
                    }
                  }
                  return comment;
                })
                // 댓글 삭제 처리: 해당 댓글을 comments 배열에서 제거 (단, 답글이 없는 경우만)
                .filter((comment: Comment) => {
                  if (comment.id === commentId && (!comment.subComments || comment.subComments.length === 0)) {
                    console.log('댓글 삭제 처리 (필터링):', commentId);
                    return false; // 댓글 제거
                  }
                  // 댓글에 답글이 남아있으면 삭제 표시만 함 (혹은 댓글을 유지)
                  if (comment.id === commentId && comment.subComments && comment.subComments.length > 0) {
                    console.log('댓글 삭제 처리 (내용 변경):', commentId);
                    return { ...comment, content: '삭제된 댓글입니다.', isDeleted: true };
                  }
                  return true; // 댓글 유지
                }),
            };
          }),
        };
      });

      return { previousData };
    },
    onSuccess: (data, commentId) => {
      console.log('삭제 성공, 데이터 무효화 실행:', commentId);
      // 성공 시 캐시 무효화하여 최신 데이터 반영 (onSettled 에서도 실행됨)
      // queryClient.invalidateQueries({ queryKey: ['qnaList', makerId, currentPage] });
    },
    onError: (error, variables, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(['qnaList', makerId, currentPage], context.previousData);
      }
      console.error('삭제 실패:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    },
    onSettled: () => {
      console.log('삭제 onSettled: 데이터 무효화 실행');
      // 작업 완료 후 (성공/실패 여부 관계없이) 최신 데이터 불러오기
      queryClient.invalidateQueries({ queryKey: ['qnaList', makerId, currentPage] });
    },
  });

  // 댓글 추가 mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ qnaId, content }: { qnaId: number; content: string }) => {
      return await createComment(qnaId, content);
    },
    onSuccess: (data) => {
      // 새 댓글의 ID와 QnA ID를 저장
      if (data && data.id) {
        setNewCommentId(data.id);
        setNewCommentQnaId(data.qnaId);
      }
      queryClient.invalidateQueries({ queryKey: ['qnaList', makerId] });
    },
    onError: (error) => {
      console.error('댓글 추가에 실패했습니다:', error);
    },
  });

  // 답글 추가 mutation
  const addReplyMutation = useMutation({
    mutationFn: async ({ qnaId, commentId, content }: { qnaId: number; commentId: number; content: string }) => {
      return await createReply(qnaId, commentId, content);
    },
    onSuccess: (data, variables) => {
      // 답글 추가 후 전체 데이터를 다시 불러오도록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['qnaList', makerId, currentPage] });
    },
    onError: (error) => {
      alert('답글 추가에 실패했습니다.');
    },
  });

  const handleAddQna = (title: string, content: string) => {
    createQnaMutation.mutate({ title, content });
  };

  const handleAddComment = (qnaId: number, content: string) => {
    addCommentMutation.mutate({ qnaId, content });
  };

  const handleAddReply = (qnaId: number, commentId: number, content: string) => {
    addReplyMutation.mutate({ qnaId, commentId, content });
  };

  const handleDeleteComment = (targetId: number, isReply: boolean = false, parentId?: number) => {
    console.log('삭제 시도:', { targetId, isReply, parentId, type: isReply ? '답글' : '댓글' });

    if (typeof targetId !== 'number' || isNaN(targetId)) {
      console.error('유효하지 않은 ID:', targetId);
      return;
    }

    const confirmMessage = isReply ? '정말로 이 답글을 삭제하시겠습니까?' : '정말로 이 댓글을 삭제하시겠습니까?';
    if (window.confirm(confirmMessage)) {
      deleteCommentMutation.mutate(targetId);
    }
  };

  const handleUpdateComment = (commentId: number, content: string, parentId?: number) => {
    console.log('handleUpdateComment 호출:', { commentId, content, parentId });
    updateCommentMutation.mutate({ commentId, content });
  };

  const handleQnaUpdated = (updatedQna: QnaItemType) => {
    // React Query가 자동으로 데이터를 업데이트하므로 별도의 로직이 필요 없음
  };

  const handleQnaDeleted = (qnaId: number) => {
    // React Query가 자동으로 데이터를 업데이트하므로 별도의 로직이 필요 없음
  };

  // 페이지 이동 핸들러
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (qnaData && currentPage < qnaData.totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // 페이지 번호 클릭 핸들러
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    if (!qnaData) return [];

    const totalPages = qnaData.totalPages;
    const pageNumbers = [];

    // 최대 5개의 페이지 번호만 표시
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // 시작 페이지 조정
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    if (content.length > 100) {
      alert('내용은 100자 이하로 입력해주세요.');
      return;
    }

    try {
      await handleAddQna(title, content);
      setTitle('');
      setContent('');
      setShowQnaForm(false);
    } catch (error) {
      console.error('Q&A 작성 중 오류 발생:', error);
    }
  };

  // 정렬된 게시글 목록 가져오기
  const getSortedItems = () => {
    if (!qnaData?.items) return [];
    return [...qnaData.items].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
  };

  if (isLoading && !qnaData) {
    return <div className="flex justify-center items-center h-full">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">QnA 목록을 불러오는데 실패했습니다.</div>
    );
  }

  return (
    <div className="flex flex-col bg-white/10 rounded-2xl h-full px-4 backdrop-blur-xs">
      <div className="p-5 flex items-center justify-between">
        <h3 className="text-xl font-bold">Q&A 게시판</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border-gray-5 border bg-gray-7 hover:bg-gray-6 rounded-lg transition-colors">
            <ArrowUpDown size={16} />
            {sortOrder === 'latest' ? '최신순' : '오래된순'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-lg px-4">
        <div className="space-y-2">
          {qnaData?.items && qnaData.items.length > 0 ? (
            getSortedItems().map((qna: QnaItemType, index: number) => {
              const processedQna = {
                ...qna,
                qnaId: qna.qnaId,
                commentId: qna.comments,
                writerId: qna.qnaId || (user.isLoggedIn && user.nickname === qna.writer ? user.id : undefined),
                comments: qna.comments?.map((comment) => ({
                  ...comment,
                  isDeleted: comment.isDeleted || comment.content === '삭제된 댓글입니다.',
                })),
              };

              return (
                <QnaItem
                  key={`qna-${qna.qnaId || index}`}
                  qna={processedQna}
                  onQnaUpdated={handleQnaUpdated}
                  onQnaDeleted={handleQnaDeleted}
                  onAddComment={handleAddComment}
                  onAddReply={handleAddReply}
                  onDeleteComment={handleDeleteComment}
                  onUpdateComment={handleUpdateComment}
                  newCommentId={newCommentId}
                />
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-400">아직 Q&A가 없습니다. 첫 질문을 남겨보세요!</div>
          )}
        </div>
      </div>

      {/* 페이지네이션 UI */}
      {qnaData && qnaData.items.length > 0 && qnaData.totalPages > 1 && (
        <div className="flex justify-center items-center py-4 px-4 border-t border-gray-7">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`p-2 rounded-md ${currentPage === 0 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}>
            <ChevronLeft size={20} />
          </button>

          <div className="flex mx-2">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                className={`w-8 h-8 mx-1 rounded-md ${
                  currentPage === pageNum ? 'bg-gray-6 text-white' : 'text-white hover:bg-gray-7'
                }`}>
                {pageNum + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={!qnaData || currentPage >= qnaData.totalPages - 1}
            className={`p-2 rounded-md ${
              !qnaData || currentPage >= qnaData.totalPages - 1
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-white hover:bg-gray-700'
            }`}>
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Q&A 작성 영역 */}
      <div className="px-4 py-3 border-t border-gray-5">
        <div className="flex justify-end">
          <div className="min-w-[40px] w-10 h-10 rounded-full overflow-hidden">
            <img
              src={user.headImage || '/no-poster.png'}
              alt={user.nickname || ''}
              className="w-full h-full object-cover"
              style={{ aspectRatio: '1/1' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/no-poster.png';
              }}
            />
          </div>
          <div className="flex-1 mx-3">
            <input
              type="text"
              placeholder={`${actorName}님과 소통해보세요!`}
              className="w-full p-3 bg-gray-7 rounded-xl text-sm font-light"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onClick={() => setShowQnaForm(true)}
            />
            <div
              className={`overflow-hidden transition-all duration-300 ${showQnaForm ? 'animate-expand mt-4' : 'h-0'}`}>
              <textarea
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-[calc(100%-4px)] m-[2px] rounded-xl text-sm font-light p-3 bg-gray-7 h-32 resize-none"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowQnaForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-cherry-blush text-white rounded-xl hover:bg-cherry-blush/90">
                  작성완료
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QnABoard;
