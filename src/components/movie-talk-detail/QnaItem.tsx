import { useState } from 'react';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import QnaPostInput from './QnaPostInput';
import { MoreVertical, Edit, Trash } from 'lucide-react';

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

interface QnaItemType {
id: number;
qnaId?: number;
title: string;
writerName: string;
writerImage: string;
createdAt: string;
updatedAt: string | null;
content: string;
commentsNum: number;
comments?: Comment[];
}

interface QnaItemProps {
qna: QnaItemType;
onAddComment: (content: string) => void;
onAddReply: (commentId: number, content: string) => void;
onUpdateQna?: (qnaId: number, title: string, content: string) => void;
onDeleteQna?: (qnaId: number) => void;
}

const QnaItem = ({ qna, onAddComment, onAddReply, onUpdateQna, onDeleteQna }: QnaItemProps) => {
const [showComments, setShowComments] = useState(false);
const [showMenu, setShowMenu] = useState(false);
const [isEditing, setIsEditing] = useState(false);
console.log('QnaItem qna:', {qna});

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

const handleUpdateSubmit = (title: string, content: string) => {
  console.log('Updating QNA with ID:', qna.qnaId);
  if (onUpdateQna && qna.qnaId) {
    onUpdateQna(qna.qnaId, title, content);
  } else {
    console.error('Invalid QNA ID or onUpdateQna function');
  }
  setIsEditing(false);
};

const handleDeleteClick = () => {
if (onDeleteQna && confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
onDeleteQna(qna.id);
}
setShowMenu(false);
};

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

return (
<div className="bg-gray-800/30 rounded-lg p-4">
<div className="flex items-start mb-3">
<div className="w-10 h-10 rounded-full overflow-hidden mr-3">
<img
src={qna.writerImage || '/default-avatar.png'}
alt={qna.writerName}
className="w-full h-full object-cover"
onError={(e) => {
(e.target as HTMLImageElement).src = '/default-avatar.png';
}}
/>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-bold text-lg">{qna.title}</h4>
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
<button onClick={handleEditClick} className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600" >
<Edit size={16} className="mr-2" />
수정하기
</button>
</li>
<li>
<button onClick={handleDeleteClick} className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600" >
<Trash size={16} className="mr-2" />
삭제하기
</button>
</li>
</ul>
</div>
)}
</div>
</div>
<div className="flex items-center text-sm text-gray-400 mb-2">
<span>{qna.writerName}</span>
<span className="mx-2">- </span>
<span>{formatDate(qna.createdAt)}</span>
</div>
<p className="text-white/90">{qna.content}</p>
</div>
</div>

  <div className="border-t border-gray-700 pt-3">
    <button 
      onClick={() => setShowComments(!showComments)}
      className="text-blue-400 hover:text-blue-300 transition"
    >
      {showComments ? '댓글 숨기기' : `댓글 ${qna.comments?.length || 0}개 보기`}
    </button>
  </div>
  
  {showComments && (
    <div className="mt-4 pl-6 border-l-2 border-gray-700">
      {qna.comments && qna.comments.length > 0 ? (
        <div className="space-y-4">
        {qna.comments.map(comment => (
          <CommentItem 
            key={comment.id} 
            id={comment.id}
            writerName={comment.writerName}
            writerImage={comment.writerImage}
            content={comment.content}
            createdAt={comment.createdAt}
            cocomments={comment.cocomments}
            onAddReply={(content: string) => onAddReply(comment.id, content)} 
          />
        ))}
        </div>
      ) : (
        <div className="text-gray-400 mb-4">아직 댓글이 없습니다.</div>
      )}
      
      <div className="mt-4">
        <CommentInput onSubmit={(content: string) => onAddComment(content)} placeholder="댓글을 입력하세요" />
      </div>
    </div>
  )}
</div>
);
};

export default QnaItem;