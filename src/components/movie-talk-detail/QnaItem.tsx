import { useState, useEffect, useRef } from 'react';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import QnaPostInput from './QnaPostInput';
import { MoreVertical } from 'lucide-react';
import QnaMenu from './QnaMenu';
import { useUserStore } from '../../store/userStore';
import { createComment, createReply, updateQna, deleteQna } from '../../api/actor/getQna';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 답글(대댓글) 인터페이스 정의
interface SubComment {
  id: number;
  writer: string;
  writerImage: string | null;
  content: string;
  createdAt: string;
}

// 댓글 인터페이스 정의
interface Comment {
  id: number;
  writer: string;
  writerImage: string | null;
  content: string;
  createdAt: string;
  subComments?: SubComment[]; // 답글 목록 (선택적)
  writerId?: number; // 작성자 ID 추가
}

// QnA 게시글 인터페이스 정의
interface QnaItemType {
  id: number;
  qnaId: number;
  title: string;
  writer: string;
  writerImage: string | null;
  writerId?: number;
  userId?: number;
  createdAt: string;
  updatedAt: string | null;
  content: string;
  comments?: Comment[];
}

// QnaItem 컴포넌트의 props 인터페이스 정의
interface QnaItemProps {
  qna: QnaItemType;
  onQnaUpdated: (updatedQna: QnaItemType) => void; // QnA 업데이트 시 호출되는 콜백
  onQnaDeleted: (qnaId: number) => void; // QnA 삭제 시 호출되는 콜백
}

const QnaItem = ({ qna, onQnaUpdated, onQnaDeleted }: QnaItemProps) => {
  // UI 상태 관리
  const [showComments, setShowComments] = useState(false); // 댓글 표시 여부
  const [showMenu, setShowMenu] = useState(false); // 메뉴 표시 여부
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  
  // 메뉴 참조 생성
  const menuRef = useRef<HTMLDivElement>(null);
  
  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 사용자 정보 및 React Query 클라이언트 가져오기
  const user = useUserStore();
  const queryClient = useQueryClient();
  
  // 현재 로그인한 사용자가 글쓴 사람인지 확인
  const isAuthor = user.isLoggedIn && user.id !== null && 
    (user.id === qna.writerId || user.id === qna.userId || user.nickname === qna.writer);
  
  console.log('QnaItem 작성자 확인:', {
    userId: user.id,
    writerId: qna.writerId,
    qnaUserId: qna.userId,
    userNickname: user.nickname,
    writerName: qna.writer,
    isLoggedIn: user.isLoggedIn,
    isAuthor: isAuthor,
    qna: qna
  });

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  // 메뉴 토글 핸들러
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    console.log('메뉴 토글:', !showMenu);
    setShowMenu(!showMenu);
  };

  // QnA 수정 mutation 정의
  // 이 mutation은 게시글의 제목과 내용을 업데이트하는 API를 호출합니다.
  const updateQnaMutation = useMutation({
    // mutation 함수: API 호출 로직
    mutationFn: async ({ title, content }: { title: string, content: string }) => {
      return await updateQna(qna.qnaId, title, content);
    },
    // 성공 시 실행되는 콜백
    onSuccess: (data) => {
      console.log("QnA 수정 API 응답:", data);
      
      // 수정된 QnA 정보로 상태 업데이트
      const updatedQna: QnaItemType = {
        ...qna,
        title: data.title || qna.title,
        content: data.content || qna.content,
        updatedAt: new Date().toISOString(),
      };
      
      // 부모 컴포넌트에 업데이트 알림
      onQnaUpdated(updatedQna);
      // 수정 모드 종료
      setIsEditing(false);
      
      // QnA 목록 쿼리 무효화
      // 이렇게 하면 React Query가 자동으로 'qnaList' 쿼리를 다시 가져와 최신 데이터로 UI를 업데이트합니다.
      queryClient.invalidateQueries({ queryKey: ['qnaList'] });
    },
    // 실패 시 실행되는 콜백
    onError: (error) => {
      console.error("QnA 수정에 실패했습니다:", error);
    }
  });

  // QnA 삭제 mutation 정의
  // 이 mutation은 게시글을 삭제하는 API를 호출합니다.
  const deleteQnaMutation = useMutation({
    // mutation 함수: API 호출 로직
    mutationFn: async () => {
      return await deleteQna(qna.qnaId);
    },
    // 성공 시 실행되는 콜백
    onSuccess: () => {
      console.log("QnA 삭제 성공:", qna.qnaId);
      // 부모 컴포넌트에 삭제 알림
      onQnaDeleted(qna.qnaId);
      
      // QnA 목록 쿼리 무효화
      // 이렇게 하면 React Query가 자동으로 'qnaList' 쿼리를 다시 가져와 최신 데이터로 UI를 업데이트합니다.
      queryClient.invalidateQueries({ queryKey: ['qnaList'] });
    },
    // 실패 시 실행되는 콜백
    onError: (error) => {
      console.error("QnA 삭제에 실패했습니다:", error);
    }
  });

  // 댓글 추가 mutation 정의
  // 이 mutation은 게시글에 댓글을 추가하는 API를 호출합니다.
  const addCommentMutation = useMutation({
    // mutation 함수: API 호출 로직
    mutationFn: async (content: string) => {
      return await createComment(qna.qnaId, content);
    },
    // 성공 시 실행되는 콜백
    onSuccess: (data) => {
      console.log("댓글 생성 API 응답:", data);
      
      // QnA 목록 쿼리 무효화
      // 이렇게 하면 React Query가 자동으로 'qnaList' 쿼리를 다시 가져와 최신 데이터로 UI를 업데이트합니다.
      queryClient.invalidateQueries({ queryKey: ['qnaList'] });
    },
    // 실패 시 실행되는 콜백
    onError: (error) => {
      console.error("댓글 추가에 실패했습니다:", error);
    }
  });

  // 답글 추가 mutation 정의
  // 이 mutation은 댓글에 답글을 추가하는 API를 호출합니다.
  const addReplyMutation = useMutation({
    // mutation 함수: API 호출 로직
    mutationFn: async ({ commentId, content }: { commentId: number, content: string }) => {
      return await createReply(qna.qnaId, commentId, content);
    },
    // 성공 시 실행되는 콜백
    onSuccess: (data) => {
      console.log("답글 생성 API 응답:", data);
      
      // QnA 목록 쿼리 무효화
      // 이렇게 하면 React Query가 자동으로 'qnaList' 쿼리를 다시 가져와 최신 데이터로 UI를 업데이트합니다.
      queryClient.invalidateQueries({ queryKey: ['qnaList'] });
    },
    // 실패 시 실행되는 콜백
    onError: (error) => {
      console.error("답글 추가에 실패했습니다:", error);
    }
  });

  // 게시글 수정 제출 핸들러
  const handleUpdateSubmit = (title: string, content: string) => {
    // updateQnaMutation 실행
    updateQnaMutation.mutate({ title, content });
  };

  // 게시글 삭제 클릭 핸들러
  const handleDeleteClick = () => {
    // 삭제 확인 후 deleteQnaMutation 실행
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deleteQnaMutation.mutate();
    }
    setShowMenu(false);
  };

  // 댓글 추가 핸들러
  const handleAddComment = (content: string) => {
    // addCommentMutation 실행
    addCommentMutation.mutate(content);
  };

  // 답글 추가 핸들러
  const handleAddReply = (commentId: number, content: string) => {
    // addReplyMutation 실행
    addReplyMutation.mutate({ commentId, content });
  };

  // 수정 모드일 때 수정 폼 렌더링
  if (isEditing) {
    return (
      <div className="bg-gray-800/30 rounded-lg p-4">
        <h4 className="font-bold text-lg mb-4">게시글 수정</h4>
        <QnaPostInput
          initialTitle={qna.title}
          initialContent={qna.content}
          onSubmit={handleUpdateSubmit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  // 일반 모드일 때 게시글 렌더링
  return (
    <div className=" bg-gray-8/50 rounded-lg p-4">
      
      <div className="flex flex-col items-start">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-lg mb-2">제목: {qna.title}</h4>
          {isAuthor && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-white p-1"
              >
                <MoreVertical size={18} />
              </button>
              {showMenu && (
                <QnaMenu 
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              )}
            </div>
          )}
        </div>
        <div className="flex"> 
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img
              src={qna.writerImage || '/no-poster.png'}
            alt={qna.writer}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/no-poster.png';
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center just text-sm text-gray-400 mb-2 gap-2">
            <span>{qna.writer}</span>
            <span className='text-gray-5 text-xs font-extralight'>{formatDate(qna.createdAt)}</span>
          </div>
          <p className="text-gray-4">{qna.content}</p>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="text-gray-4 hover:text-blue-300 text-xs font-extralight underline transition pt-3"
        >
          {showComments ? '댓글 숨기기' : `댓글 ${qna.comments?.length || 0}개 보기`}
        </button>
        </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 pl-6 border-l-2 border-gray-5">
          {qna.comments && qna.comments.length > 0 ? (
            <div className="space-y-4">
              {qna.comments.map((comment, index) => (
                <CommentItem 
                  key={`comment-${comment.id || index}`} 
                  id={comment.id}
                  writer={comment.writer}
                  writerImage={comment.writerImage}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  subComments={comment.subComments}
                  onAddReply={(content: string) => handleAddReply(comment.id, content)} 
                  writerId={comment.writerId}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-5 mb-4 text-sm">아직 댓글이 없습니다.</div>
          )}
          
          <div className="mt-4">
            <CommentInput onSubmit={(content: string) => handleAddComment(content)} placeholder="댓글을 입력하세요" />
          </div>
        </div>
      )}
    </div>
  );
};

export default QnaItem;