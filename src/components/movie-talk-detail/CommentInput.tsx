import { Send } from 'lucide-react';
import { useState } from 'react';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isReply?: boolean;
}

const CommentInput = ({ onSubmit, isReply = false }: CommentInputProps) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim()) {
      onSubmit(newComment);
      setNewComment('');
    }
  };

  return (
    <div className={`${!isReply ? 'border-t border-gray-5/50 bg-gray-8/50 p-4 mb-3 rounded-b-lg' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-4 rounded-full flex-shrink-0" />
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={isReply ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
            className="flex-1 bg-gray-4/50 rounded-full py-2 px-4 focus:outline-none text-sm"
          />
          <button 
            onClick={handleSubmit}
            className="rounded-lg text-sm font-light py-2 px-3 bg-gray-4/50 text-white hover:text-cherry-blush hover:bg-white hover:font-bold flex items-center justify-center"
            disabled={!newComment.trim()}
          >
            게시
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput; 