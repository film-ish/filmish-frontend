import { Check, ChevronDown, Dot, MoreHorizontal } from 'lucide-react';
import IconButton from '../../../common/IconButton';
import ProfileImage from '../../../common/ProfileImage';
import { useState } from 'react';
import Menu from '../../common/Menu';
import CommentForm from '../../common/CommentForm';
import { useUserStore } from '../../../../store/userStore';

interface CommentCardProps {
  depth?: number;
  comment: ReviewComment;
  onAddComment: (commentId: string, content: string) => void;
  onDeleteComment?: (input: { commentId: number }) => void;
  onUpdateComment: (commentId: number, content: string) => void;
}

const CommentCard = ({ depth = 0, comment, onAddComment, onDeleteComment, onUpdateComment }: CommentCardProps) => {
  const user = useUserStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 50) {
      alert('최대 50자까지 입력할 수 있습니다.');
      return;
    }
    setEditedComment(e.target.value);
  };

  const handleUpdateInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editedComment.trim() === '' || editedComment.trim() === comment.content) {
      setShowMoreActions(false);
      setShowCommentForm(false);
      setEditedComment(comment.content);
      setIsEditing(false);
      return;
    }

    onUpdateComment(comment.id, editedComment);
    setIsEditing(false);
  };

  const onSubmitSubComment = (content: string) => {
    onAddComment(comment.id, content);
    setShowCommentForm(false);
    setIsExpanded(true);
  };

  const [showMoreActions, setShowMoreActions] = useState(false);

  const moreActionItems = [
    {
      name: '수정',
      onClick: () => {
        setShowMoreActions(false);
        setIsEditing(true);
      },
    },
    {
      name: '삭제',
      onClick: () => {
        setShowMoreActions(false);
        onDeleteComment({ commentId: comment.id });
      },
    },
  ];

  return (
    <div className="w-full flex flex-col justify-between gap-2">
      <div className="min-w-0 flex-1 w-full flex items-start justify-between">
        <div className="min-w-0 flex-1 w-full flex items-start gap-2">
          <ProfileImage src={comment.writerImage} />
          <div className="w-full flex flex-col break-words overflow-hidden">
            <div className="text-label-md font-bold truncate">{comment.writer}</div>

            {!isEditing && comment.content && <div className="text-paragraph-md">{comment.content}</div>}

            {isEditing && (
              <form className="w-full flex gap-2 justify-between" onSubmit={handleUpdateInputSubmit}>
                <input
                  className={
                    'w-full text-paragraph-md border-b-[1px] focus:outline-none focus:ring-0 focus:border-b-[1px] focus:border-b-white' +
                    (comment.content ? ' border-b-white' : ' border-b-gray-4')
                  }
                  type="text"
                  placeholder="댓글 수정 중... (최대 50자)"
                  value={editedComment}
                  onChange={handleUpdateInputChange}
                />

                <IconButton className="bg-gray-6">
                  <Check />
                </IconButton>
              </form>
            )}
          </div>
        </div>

        {comment.writer === user.nickname && comment.content !== '삭제된 댓글입니다.' && !isEditing && (
          <div>
            {showMoreActions && <Menu items={moreActionItems} closeMenu={() => setShowMoreActions(false)} />}
            <IconButton size={30} onClick={() => setShowMoreActions(!showMoreActions)}>
              <MoreHorizontal size={20} />
            </IconButton>
          </div>
        )}
      </div>

      {depth === 0 && (
        <div className="flex flex-col gap-2 pl-[44px]">
          <div className="flex items-center text-label-sm text-gray-4">
            {comment.subComments?.length > 0 && (
              <>
                <button className="w-fit flex items-center gap-1" onClick={() => setIsExpanded(!isExpanded)}>
                  <div className="w-5 h-5 rounded-full hover:bg-white/50 transition-colors flex items-center justify-center">
                    <ChevronDown size={16} className={`${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                  <span>
                    답글
                    {comment.subComments?.length && ` ${comment.subComments?.length}개`}
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
                onSubmit={(content) => {
                  onSubmitSubComment(content);
                }}
                onCancel={() => setShowCommentForm(false)}
                placeholder="답글을 입력하세요 (최대 50자)"
              />
            </div>
          )}

          {isExpanded && comment.subComments?.length > 0 && (
            <div className="w-full flex flex-col gap-4">
              {comment.subComments.map((subComment) => {
                return (
                  <CommentCard
                    key={subComment.id}
                    depth={depth + 1}
                    comment={subComment}
                    isOwner={subComment.writer === user.nickname}
                    onAddComment={onAddComment}
                    onUpdateComment={onUpdateComment}
                    onDeleteComment={onDeleteComment}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
