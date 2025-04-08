import { useState } from 'react';
import CommentInput from './CommentInput';

interface CoComment {
id: number;
writerName: string;
writerImage: string;
content: string;
createdAt: string;
}

interface Comment {
id: number;
writerName: string;
writerImage: string;
content: string;
createdAt: string;
cocomments?: CoComment[];
}

interface CommentItemProps {
id: number;
writerName: string;
writerImage: string;
content: string;
createdAt: string;
cocomments?: CoComment[];
onAddReply: (content: string) => void;
}

const CommentItem = ({ id, writerName, writerImage, content, createdAt, cocomments, onAddReply }: CommentItemProps) => {
const [showReplyForm, setShowReplyForm] = useState(false);

const formatDate = (dateString: string) => {
const date = new Date(dateString);
return date.toLocaleDateString('ko-KR', {
year: 'numeric',
month: 'long',
day: 'numeric',
});
};

return (
<div className="mb-3">
<div className="flex items-start">
<div className="w-8 h-8 rounded-full overflow-hidden mr-2">
<img
src={writerImage || '/default-avatar.png'}
alt={writerName}
className="w-full h-full object-cover"
onError={(e) => {
(e.target as HTMLImageElement).src = '/default-avatar.png';
}}
/>
</div>
<div className="flex-1">
<div className="flex items-center">
<span className="font-semibold mr-2">{writerName}</span>
<span className="text-xs text-gray-400">{formatDate(createdAt)}</span>
</div>
<p className="text-white/90 mt-1">{content}</p>


      <button 
        onClick={() => setShowReplyForm(!showReplyForm)}
        className="text-blue-400 text-sm mt-1 hover:text-blue-300 transition"
      >
        {showReplyForm ? '취소' : '답글 달기'}
      </button>
      
      {/* 대댓글 목록 */}
      {cocomments && cocomments.length > 0 && (
        <div className="mt-3 pl-4 border-l border-gray-700">
          {cocomments.map(reply => (
            <div key={reply.id} className="mb-2">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                  <img 
                    src={reply.writerImage || '/default-avatar.png'} 
                    alt={reply.writerName} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-avatar.png';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2 text-sm">{reply.writerName}</span>
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