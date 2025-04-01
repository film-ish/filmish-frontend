import { ChevronDown, Dot, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import CommentInput from './CommentInput';

interface CommentProps {
  author: string;
  content: string;
  timestamp: string;
  replies?: CommentProps[];
  isReply?: boolean;
  onAddReply?: (content: string) => void;
}

const Comment = ({ author, content, timestamp, replies, isReply = false, onAddReply }: CommentProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleAddReply = (content: string) => {
    if (onAddReply) {
      onAddReply(content);
      setShowReplyInput(false);
    }
  };

  const commentContent = (
    <>
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="w-8 h-8 bg-gray-4 rounded-full flex-shrink-0" />
          {!isReply && replies && replies.length > 0 && showReplies && (
            <div className="absolute w-[2px] bg-gray-5 left-1/2 top-10 bottom-0 transform -translate-x-1/2 h-full rounded-full" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{author}</span>
              <span className="text-xs text-gray-5">{timestamp}</span>
            </div>
            <button className="text-gray-4 hover:text-white">
              <MoreVertical className="w-4 h-4 text-gray-5" />
            </button>
          </div>
          <p className="mt-1 font-light text-sm text-gray-3">{content}</p>
          <div className="flex items-center gap-1 mt-2">
            {!isReply && replies && replies.length > 0 && (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="font-light text-xs text-gray-5 hover:text-white flex items-center gap-1"
              >
                <ChevronDown className={`w-4 h-4 text-rose-cloud transform ${showReplies ? 'rotate-180' : ''}`} />
                {showReplies ? '답글 접기' : `답글 ${replies.length}개 보기`}
                <Dot className="w-4 h-4 text-rose-cloud" />
              </button>
            )}
            <button 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-xs underline font-light text-gray-5 hover:text-white hover:font-light"
            >
              답글 달기
            </button>
          </div>
        </div>
      </div>

      {showReplyInput && (
        <div className="mt-3">
          <CommentInput onSubmit={handleAddReply} isReply />
        </div>
      )}
    </>
  );

  if (isReply) {
    return <div className="space-y-3">{commentContent}</div>;
  }

  return (
    <div className="bg-gray-8/50 rounded-lg p-4">
      <div className="space-y-4">
        {commentContent}
        
        {showReplies && replies && replies.length > 0 && (
          <div className="space-y-4">
            {replies.map((reply, index) => (
              <Comment 
                key={index} 
                {...reply} 
                isReply={true}
                onAddReply={onAddReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment; 