import React, { useState } from 'react';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import QnaPostInput from './QnaPostInput';
import { MoreVertical, Edit, Trash } from 'lucide-react';

interface CommentType {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

interface QnaPostProps {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  comments: CommentType[];
  onAddComment: (postId: number, content: string) => void;
  onUpdateQna?: (postId: number, title: string, content: string) => void;
  onDeleteQna?: (postId: number) => void;
}

const QnaPost: React.FC<QnaPostProps> = ({ 
  id, 
  title, 
  content, 
  author, 
  timestamp, 
  comments, 
  onAddComment,
  onUpdateQna,
  onDeleteQna
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDeleteClick = () => {
    if (onDeleteQna && confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      onDeleteQna(id);
    }
    setShowMenu(false);
  };

  const handleUpdateSubmit = (newTitle: string, newContent: string) => {
    if (onUpdateQna) {
      onUpdateQna(id, newTitle, newContent);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-gray-7 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-bold mb-4">게시글 수정</h3>
        <QnaPostInput 
          initialTitle={title}
          initialContent={content}
          onSubmit={handleUpdateSubmit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-7 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-white p-1"
          >
            <MoreVertical size={18} />
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
      </div>
      <p className="text-sm text-gray-4 mb-2">{author} - {timestamp}</p>
      <p className="mb-4">{content}</p>
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-cherry-blush hover:underline mb-2"
      >
        {showComments ? '댓글 숨기기' : `댓글 ${comments.length}개 보기`}
      </button>
      {showComments && (
        <div className="ml-4">
          {comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              id={comment.id}
              writerName={comment.author}
              writerImage=""
              content={comment.content}
              createdAt={comment.timestamp}
              onAddReply={() => {}}
            />
          ))}
          <CommentInput onSubmit={(content) => onAddComment(id, content)} />
        </div>
      )}
    </div>
  );
};

export default QnaPost;
