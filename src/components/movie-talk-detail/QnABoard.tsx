import React, { useState } from 'react';
import QnaItem from './QnaItem';
import QnaPostInput from './QnaPostInput';
import { createQna, listQna } from '../../api/actor/getQna';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

interface SubComment {
  id: number;
  writer: string;
  writerImage: string | null;
  content: string;
  createdAt: string;
}

interface Comment {
  id: number;
  writer: string;
  writerImage: string | null;
  content: string;
  createdAt: string;
  subComments?: SubComment[];
}

interface QnaItemType {
  qnaId: number;
  title: string;
  writer: string;
  writerImage: string | null;
  writerId?: number;
  createdAt: string;
  updatedAt: string | null;
  content: string;
  comments?: Comment[];
  userId?: number;
}

interface QnABoardProps {
  makerId: number;
}

// 페이지네이션 데이터 인터페이스
interface QnaData {
  items: QnaItemType[];
  totalPages: number;
}

// 페이지당 항목 수
const PAGE_SIZE = 10;

const QnABoard = ({ makerId }: QnABoardProps) => {
  const [showQnaForm, setShowQnaForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 0부터 시작하는 페이지 번호
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();
  const user = useUserStore.getState();
  // QnA 목록 가져오기 (페이지네이션 적용)
  const { data: qnaData, isLoading, error } = useQuery<QnaData>({
    queryKey: ['qnaList', makerId, currentPage],
    queryFn: async () => {
      const response = await listQna(makerId, currentPage, PAGE_SIZE);
      console.log("QnA 응답 결과:", response);
      
      // 응답이 배열인 경우 처리
      if (Array.isArray(response)) {
        // 현재 로그인한 사용자 정보 가져오기
        const user = useUserStore.getState();
        console.log("현재 로그인한 사용자:", user);
        
        // writerId가 없는 경우 현재 로그인한 사용자의 ID를 사용
        const processedItems = response.map(item => {
          console.log('QnA 항목:', item);
          
          // 작성자 이름이 현재 로그인한 사용자의 닉네임과 같으면 현재 사용자의 ID를 writerId로 설정
          const isCurrentUser = user.isLoggedIn && user.nickname === item.writer;
          
          return {
            ...item,
            writerId: isCurrentUser ? user.id : undefined,
            userId: isCurrentUser ? user.id : undefined
          };
        });
        
        return {
          items: processedItems,
          totalPages: Math.ceil(response.length / PAGE_SIZE) || 1
        };
      }
      
      // 응답이 객체인 경우 처리 (필요시 추가)
      return {
        items: [],
        totalPages: 1
      };
    },
    placeholderData: (previousData) => previousData || { items: [], totalPages: 1 }
  });

  // QnA 생성 mutation
  const createQnaMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string, content: string }) => {
      return await createQna(makerId, title, content);
    },
    onSuccess: (data) => {
      console.log("QnA 생성 API 응답:", data);
      setShowQnaForm(false);
      
      // QnA 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['qnaList', makerId] });
      
      // 새 게시글이 추가되면 첫 페이지로 이동
      setCurrentPage(0);
    },
    onError: (error) => {
      console.error("QnA 추가에 실패했습니다:", error);
    }
  });

  const handleAddQna = (title: string, content: string) => {
    createQnaMutation.mutate({ title, content });
  };

  const handleQnaUpdated = (updatedQna: QnaItemType) => {
    // React Query가 자동으로 데이터를 업데이트하므로 별도의 로직이 필요 없음
    console.log("QnA 업데이트됨:", updatedQna);
  };

  const handleQnaDeleted = (qnaId: number) => {
    // React Query가 자동으로 데이터를 업데이트하므로 별도의 로직이 필요 없음
    console.log("QnA 삭제됨:", qnaId);
  };

  // 페이지 이동 핸들러
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (qnaData && currentPage < qnaData.totalPages - 1) {
      setCurrentPage(prev => prev + 1);
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
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
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
    try {
      await handleAddQna(title, content);
      setTitle('');
      setContent('');
      setShowQnaForm(false);
    } catch (error) {
      console.error('Q&A 작성 중 오류 발생:', error);
    }
  };

  console.log('QnaBoard qnaList:', qnaData?.items);

  if (isLoading && !qnaData) {
    return <div className="flex justify-center items-center h-full">로딩 중...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">QnA 목록을 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className="flex flex-col bg-white/10 rounded-2xl h-full px-4 backdrop-blur-xs">
      <div className="p-5 flex items-center">
        <h3 className="text-xl font-bold">Q&A 게시판</h3>
      </div>

      <div className="flex-1 overflow-y-auto rounded-lg px-4">
        <div className="space-y-2">
          {qnaData?.items && qnaData.items.length > 0 ? (
            qnaData.items.map((qna: QnaItemType, index: number) => {
              console.log('QnABoard에서 QnaItem으로 전달되는 데이터:', {
                qnaId: qna.qnaId,
                writerId: qna.writerId,
                userId: qna.userId,
                writer: qna.writer
              });
              
              const processedQna = {
                ...qna,
                id: qna.qnaId,
                writerId: qna.writerId || qna.userId
              };
              
              return (
                <QnaItem 
                  key={`qna-${qna.qnaId || index}`} 
                  qna={processedQna}
                  onQnaUpdated={handleQnaUpdated}
                  onQnaDeleted={handleQnaDeleted}
                />
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-400">
              아직 Q&A가 없습니다. 첫 질문을 남겨보세요!
            </div>
          )}
        </div>
      </div>

      {/* 페이지네이션 UI */}
      {qnaData && qnaData.items.length > 0 && qnaData.totalPages > 1 && (
        <div className="flex justify-center items-center py-4 px-4 border-t border-gray-7">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`p-2 rounded-md ${currentPage === 0 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex mx-2">
            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                className={`w-8 h-8 mx-1 rounded-md ${
                  currentPage === pageNum
                    ? 'bg-gray-6 text-white'
                    : 'text-white hover:bg-gray-7'
                }`}
              >
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
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Q&A 작성 영역 */}
      <div className="px-4 py-3 border-t border-gray-7">
        <div className='flex justify-end'>
          <div className='min-w-[40px] w-10 h-10 rounded-full overflow-hidden'>
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
              placeholder='제목을 입력하세요' 
              className='w-full p-3 bg-gray-7 rounded-xl text-sm font-light'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onClick={() => setShowQnaForm(true)}
            />
            <div className={`overflow-hidden transition-all duration-300 ${showQnaForm ? 'animate-expand mt-4' : 'h-0'}`}>
              <textarea
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 bg-gray-7 rounded-md h-32"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowQnaForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
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
