import { useState, useRef, useEffect } from 'react';
import CommentInput from './CommentInput';
import { useUserStore } from '../../store/userStore';
import { MoreVertical, Edit, Trash, User, Send } from 'lucide-react';
import QnaMenu from './QnaMenu';

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

interface CommentItemProps {
  id: number;
  writer: string;
  writerImage: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  subComments?: SubComment[];
  onAddReply: (qnaId: number, parentId: number, content: string) => void;
  onDelete: (commentId: number, isReply?: boolean, parentId?: number) => void;
  onUpdate: (commentId: number, content: string, parentId?: number) => void;
  isDeleted?: boolean;
  qnaId: number;
}

const CommentItem = ({ 
  id,
  qnaId,
  writer, 
  writerImage, 
  content, 
  createdAt, 
  updatedAt, 
  subComments, 
  onAddReply,
  onDelete,
  onUpdate,
  isDeleted
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingReplyContent, setEditingReplyContent] = useState('');
  const { nickname, isLoggedIn } = useUserStore();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const isAuthor = isLoggedIn && nickname === writer;

  const handleUpdate = () => {
    if (editContent.trim()) {
      onUpdate(id, editContent, id);
      setIsEditing(false);
    }
  };

  const handleReplyUpdate = (replyId: number, currentContent: string) => {
    console.log("답글 수정 시작:", { replyId, currentContent, parentId: id });
    setEditingReplyId(replyId);
    setEditingReplyContent(currentContent);
  };

  const handleReplyUpdateSubmit = (replyId: number) => {
    console.log("답글 수정 제출:", { replyId, content: editingReplyContent, parentId: id });
    if (editingReplyContent.trim()) {
      onUpdate(replyId, editingReplyContent, id);
      setEditingReplyId(null);
      setEditingReplyContent('');
    }
  };

  const handleAddReply = () => {
    if (replyContent.trim()) {
      onAddReply(qnaId, id, replyContent);
      setReplyContent('');
      setShowReplyInput(false);
    }
  };

  const handleReplyDelete = (replyId: number) => {
    console.log("답글 삭제 시도:", { replyId, isNumber: typeof replyId === 'number', parentId: id });
    if (replyId && typeof replyId === 'number') {
      onDelete(replyId, true, id);
    } else {
      console.error("답글 삭제 실패: 유효하지 않은 replyId", replyId);
      alert('답글 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 삭제된 댓글이면서 활성 답글이 없는 경우 null 반환
  const hasVisibleReplies = subComments && subComments.some(reply => !reply.isDeleted);
  if (isDeleted && !hasVisibleReplies) {
    return null;
  }

  // 삭제된 댓글이지만 활성 답글이 있는 경우 간단한 형태로 표시
  if (isDeleted) {
    return (
      <div className="space-y-1">
        <div className="flex items-start space-x-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-5">삭제된 댓글입니다.</span>
            </div>
          </div>
        </div>

        {/* 답글 목록 */}
        {subComments && subComments.length > 0 && (
          <div className="ml-10 my-3 space-y-2">
            {subComments
              .filter(reply => !reply.isDeleted && reply.content !== "삭제된 댓글입니다.")
              .map((reply, index) => (
                <div key={`reply-${reply.id || index}`} className="flex items-start space-x-2 pl-4 border-l-2 border-gray-7">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-xs">{reply.writer}</span>
                        <span className="text-xs text-gray-5">{formatDate(reply.createdAt)}</span>
                        {reply.updatedAt && reply.updatedAt !== reply.createdAt && (
                          <span className="text-xs text-gray-5">(수정됨)</span>
                        )}
                      </div>
                      {isLoggedIn && nickname === reply.writer && !reply.isDeleted && (
                        <div className="flex items-center space-x-2">
                          {editingReplyId === reply.id ? (
                            null
                          ) : (
                            <>
                              <button
                                onClick={() => handleReplyUpdate(reply.id, reply.content)}
                                className="text-xs text-gray-5 hover:text-gray-3"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleReplyDelete(reply.id)}
                                className="text-xs text-gray-5 hover:text-gray-3"
                              >
                                삭제
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {editingReplyId === reply.id ? (
                      <div className="mt-2 space-y-2">
                        <input
                          value={editingReplyContent}
                          onChange={(e) => setEditingReplyContent(e.target.value)}
                          className="w-full p-2 text-sm bg-gray-8 rounded-xl focus:border-gray-5 focus:outline-none"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingReplyId(null);
                              setEditingReplyContent('');
                            }}
                            className="px-3 py-1 text-xs text-gray-5 hover:text-gray-3"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleReplyUpdateSubmit(reply.id)}
                            className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90"
                          >
                            수정
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-4 font-extralight break-all whitespace-pre-wrap word-break: break-word mt-1">{reply.content}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="space-y-1">
      <div className="flex items-start space-x-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <img src={writerImage || '/no-poster.png'} alt="writerImage" className="w-6 h-6 rounded-full" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{writer}</span>
              <span className="text-xs text-gray-5">{formatDate(createdAt)}</span>
              {updatedAt && (
                <span className="text-xs text-gray-5">(수정됨)</span>
              )}
            </div>
            {/* 댓글 수정/삭제 버튼 (활성 댓글에 대해서만 표시) */}
            {isAuthor && (
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  // 수정 모드일 때는 이 위치에 버튼 표시 안 함 (아래 폼에 있음)
                  null
                ) : (
                  // 일반 모드일 때 수정/삭제 버튼 표시
                  <>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-xs text-gray-5 hover:text-gray-3"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => {
                        console.log('댓글 삭제:', id);
                        onDelete(id, false, id);
                      }}
                      className="text-xs text-gray-5 hover:text-gray-3"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          {/* 댓글 내용 또는 수정 폼 (활성 댓글에 대해서만 표시) */}
          {isEditing ? (
            // 수정 폼 (Input + 오른쪽 버튼)
            <div className="flex items-center mt-2 space-x-2">
              <input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full flex-grow p-3 text-sm bg-gray-8/50 rounded-xl border border-gray-7/50 focus:border-gray-5 focus:outline-none"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="py-1 px-3 text-xs text-gray-5 hover:text-gray-3 whitespace-nowrap"
                >
                  취소
                </button>
                <button
                  onClick={handleUpdate}
                  className="py-2 px-3 text-xs bg-gray-6 text-white rounded-xl hover:bg-white hover:text-cherry-blush whitespace-nowrap"
                >
                  수정
                </button>
              </div>
            </div>
          ) : (
            // 일반 댓글 내용
            <p className="text-sm font-extralight text-gray-4 break-all whitespace-pre-wrap word-break: break-word mt-1">{content}</p>
          )}
        </div>
      </div>

      {/* 답글 입력 폼  */}
      
      <div className="ml-10 mb-3">
        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="text-xs font-light text-gray-5 hover:text-gray-3"
        >
          {showReplyInput ? '답글 취소' : '답글 달기'}
        </button>
        
        {showReplyInput && (
          <div className="flex mt-2">
            <input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full py-2 px-3 text-sm mr-2 font-extralight bg-gray-8/50 rounded-xl border border-gray-7 focus:border-gray-5 focus:outline-none"
              placeholder="답글을 입력하세요"
            />
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={handleAddReply}
                className="p-2 bg-gray-6 rounded-full hover:bg-gray-1 hover:text-cherry-blush"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
     

      {/* 답글 목록 */}
      {subComments && subComments.length > 0 && (
        <div className="ml-10 my-3 space-y-2">
          {subComments
            .filter(reply => !reply.isDeleted)
            .map((reply, index) => (
              <div key={`reply-${reply.id || index}`} className="flex items-start space-x-2 pl-4 border-l-2 border-gray-7">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <img src={reply.writerImage || '/no-poster.png'} alt="writerImage" className="w-5 h-5 rounded-full" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-xs">{reply.writer}</span>
                      <span className="text-xs text-gray-5">{formatDate(reply.createdAt)}</span>
                      {reply.updatedAt && reply.updatedAt !== reply.createdAt && (
                        <span className="text-xs text-gray-5">(수정됨)</span>
                      )}
                    </div>
                    {isLoggedIn && nickname === reply.writer && (
                      <div className="flex items-center space-x-2">
                        {editingReplyId === reply.id ? (
                          null
                        ) : (
                          <>
                            <button
                              onClick={() => handleReplyUpdate(reply.id, reply.content)}
                              className="text-xs text-gray-5 hover:text-gray-3"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleReplyDelete(reply.id)}
                              className="text-xs text-gray-5 hover:text-gray-3"
                            >
                              삭제
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {editingReplyId === reply.id ? (
                    // 수정 폼 (Input + 오른쪽 버튼)
                    <div className="flex items-center mt-2 space-x-2">
                      <input
                        value={editingReplyContent}
                        onChange={(e) => setEditingReplyContent(e.target.value)}
                        className="w-full flex-grow p-2 text-sm bg-gray-8/50 rounded-xl border border-gray-8/50 focus:border-gray-5 focus:outline-none"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingReplyId(null);
                            setEditingReplyContent('');
                          }}
                          className="py-1 px-3 text-xs text-gray-5 hover:text-gray-3 whitespace-nowrap"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleReplyUpdateSubmit(reply.id)}
                          className="py-2 px-3 text-xs bg-gray-6 text-white rounded-xl hover:bg-white hover:text-cherry-blush whitespace-nowrap"
                        >
                          수정
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 일반 답글 내용
                    <p className="text-xs text-gray-4 font-extralight break-all whitespace-pre-wrap word-break: break-word mt-1">{reply.content}</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;