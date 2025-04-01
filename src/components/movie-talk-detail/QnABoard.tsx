import Comment from './Comment';
import CommentInput from './CommentInput';

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

interface QnABoardProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onAddReply: (commentId: number, content: string) => void;
}

const QnABoard = ({ comments, onAddComment, onAddReply }: QnABoardProps) => {
  return (
    <div className="flex flex-col bg-white/10 rounded-lg h-full px-4">
      <div className="pt-5 pb-3">
        <h3 className="text-xl font-bold">Q&A 게시판</h3>
        <div className="border-b border-gray-5/50 pt-2"></div>
      </div>
      
      <div className="flex-1 overflow-y-auto rounded-lg pr-2">
        <div className="space-y-2">
          {comments.map((comment) => (
            <Comment 
              key={comment.id} 
              {...comment} 
              onAddReply={(content) => onAddReply(comment.id, content)}
            />
          ))}
        </div>
      </div>

      <CommentInput onSubmit={onAddComment} />
    </div>
  );
};

export default QnABoard; 