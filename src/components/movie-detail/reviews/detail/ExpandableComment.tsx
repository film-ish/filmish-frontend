import { ChevronDown, Dot } from 'lucide-react';
import { useState } from 'react';
import CommentForm from '../../common/CommentForm';

interface ExpandableContentProps {
  title: string;
  count?: number;
  children: React.ReactNode;
  className?: string;
  onAddComment?: (content: string) => void;
}

const ExpandableComment = ({ title, count, children, className = '', onAddComment }: ExpandableContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleSubmitComment = (content: string) => {
    onAddComment?.(content);
    setShowCommentForm(false);
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center text-label-sm text-gray-4">
        {!!count && (
          <>
            <button className="w-fit flex items-center gap-1" onClick={handleToggle}>
              <ChevronDown size={16} className={`${isExpanded ? 'rotate-180' : ''}`} />
              <span>
                {title}
                {count !== undefined && ` ${count}개`}
              </span>
            </button>

            <Dot />
          </>
        )}

        <button onClick={() => setShowCommentForm(true)}>답글 달기</button>
      </div>

      {showCommentForm && (
        <div className="pl-4">
          <CommentForm
            submitButtonColor="cherry-blush"
            onSubmit={handleSubmitComment}
            onCancel={() => setShowCommentForm(false)}
            placeholder="답글을 입력하세요"
          />
        </div>
      )}

      {isExpanded && children}
    </div>
  );
};

export default ExpandableComment;
