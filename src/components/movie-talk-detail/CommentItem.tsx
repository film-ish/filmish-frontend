import { useState } from 'react';
import CommentInput from './CommentInput';
import { useUserStore } from '../../store/userStore';
import { MoreVertical, Edit, Trash } from 'lucide-react';

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
  writerId?: number;
}

interface CommentItemProps {
  id: number;
  writer: string;
  writerImage: string | null;
  content: string;
  createdAt: string;
  subComments?: SubComment[];
  onAddReply: (content: string) => void;
  onEdit?: (id: number, content: string) => void;
  onDelete?: (id: number) => void;
  writerId?: number;
}

const CommentItem = ({ 
  id, 
  writer, 
  writerImage, 
  content, 
  createdAt, 
  subComments, 
  onAddReply,
  onEdit,
  onDelete,
  writerId
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  
  const user = useUserStore();
  
  // 현재 로그인한 사용자가 댓글 작성자인지 확인
  const isAuthor = user.isLoggedIn && user.id === writerId;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDeleteClick = () => {
    if (onDelete && confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      onDelete(id);
    }
    setShowMenu(false);
  };

  const handleUpdateSubmit = () => {
    if (onEdit) {
      onEdit(id, editedContent);
      setIsEditing(false);
    }
  };

  // 수정 모드일 때 수정 폼 렌더링
  if (isEditing) {
    return (
      <div className="mb-3 bg-gray-800/30 rounded-lg p-3">
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-md p-2 mb-2"
          rows={3}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500"
          >
            취소
          </button>
          <button
            onClick={handleUpdateSubmit}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            저장
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div className="flex items-start">
        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
          <img
            src={writerImage || '/no-poster.png'}
            alt={writer}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/no-poster.png';
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-semibold mr-2">{writer}</span>
              <span className="text-xs text-gray-400">{formatDate(createdAt)}</span>
            </div>
            {isAuthor && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <MoreVertical size={16} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-36 bg-gray-700 rounded-md shadow-lg z-10">
                    <ul className="py-1">
                      <li>
                        <button 
                          onClick={handleEditClick} 
                          className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600"
                        >
                          <Edit size={16} className="mr-2" />
                          수정하기
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={handleDeleteClick} 
                          className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600"
                        >
                          <Trash size={16} className="mr-2" />
                          삭제하기
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-white/90 mt-1">{content}</p>

          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-400 text-sm mt-1 hover:text-blue-300 transition"
          >
            {showReplyForm ? '취소' : '답글 달기'}
          </button>
          
          {/* 대댓글 목록 */}
          {subComments && subComments.length > 0 && (
            <div className="mt-3 pl-4 border-l border-gray-5">
              {subComments.map((reply, index) => (
                <div key={`reply-${reply.id || index}`} className="mb-2">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                      <img 
                        src={reply.writerImage || '/no-poster.png'} 
                        alt={reply.writer} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/no-poster.png';
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2 text-sm">{reply.writer}</span>
                        <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="text-white/90 text-sm mt-1">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* 답글 입력 폼 */}
          {showReplyForm && (
            <div className="mt-2">
              <CommentInput 
                onSubmit={(content: string) => {
                  onAddReply(content);
                  setShowReplyForm(false);
                }}
                placeholder="답글을 입력하세요"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;