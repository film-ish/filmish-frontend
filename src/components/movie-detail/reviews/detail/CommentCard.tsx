import { Check, ChevronDown, Dot, MoreHorizontal } from 'lucide-react';
import IconButton from '../../../common/IconButton';
import ProfileImage from '../../../common/ProfileImage';
import { useState } from 'react';
import Menu from '../../common/Menu';
import CocommentCard from './CocommentCard';
import CommentForm from '../../common/CommentForm';
import useCommentForm from '../../../../hooks/comment/useCommentForm';

interface CommentCardProps {
  comment: ReviewComment;
  isOwner: boolean;
  onAddComment: (commentId: string, content: string) => void;
  onDeleteComment?: (input: { commentId: number }) => void;
  onDeleteCocomment?: (input: { cocommentsId: number }) => void;
  onUpdateComment: (input: { commentId: number; content: string }) => void;
}

const CommentCard = ({
  comment,
  isOwner,
  onAddComment,
  onDeleteComment,
  onDeleteCocomment,
  onUpdateComment,
}: CommentCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const {
    comment: editedComment,
    setComment: setEditedComment,
    handleSubmit,
    isEditing,
    setIsEditing,
  } = useCommentForm(comment.content, comment.commentId, null, {
    createComment: (content: string) => onAddComment(comment.commentId, content),
    updateComment: (commentId: number, content: string) => onUpdateComment({ commentId, content }),
  });

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleSubmitComment = (content: string) => {
    onAddComment(comment.commentId, content);
    setShowCommentForm(false);
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
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex items-start justify-between">
        <div className="w-full flex items-start gap-2">
          <ProfileImage src={comment.writerImage} />
          <div className="w-full flex flex-col">
            <div className="text-label-md font-bold">{comment.writer}</div>

            {!isEditing && comment.content && <div className="text-paragraph-md">{comment.content}</div>}

            {isEditing && (
              <form className="flex gap-2" onSubmit={handleSubmit}>
                <input
                  className={
                    'text-paragraph-md w-full border-b-[1px] focus:outline-none focus:ring-0 focus:border-b-[1px] focus:border-b-white' +
                    (comment.content ? ' border-b-white' : ' border-b-gray-4')
                  }
                  type="text"
                  placeholder="댓글 수정 중..."
                  value={editedComment}
                  onChange={setEditedComment}
                />

                <IconButton className="bg-gray-6">
                  <Check />
                </IconButton>
              </form>
            )}
          </div>
        </div>

        {isOwner && !isEditing && (
          <div>
            {showMoreActions && <Menu items={moreActionItems} closeMenu={() => setShowMoreActions(false)} />}
            <IconButton className="shrink-0" size={30} onClick={() => setShowMoreActions(!showMoreActions)}>
              <MoreHorizontal size={20} />
            </IconButton>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 pl-[44px]">
        <div className="flex items-center text-label-sm text-gray-4">
          {comment.cocomments?.length > 0 && (
            <>
              <button className="w-fit flex items-center gap-1" onClick={handleToggle}>
                <ChevronDown size={16} className={`${isExpanded ? 'rotate-180' : ''}`} />
                <span>
                  답글
                  {comment.cocomments?.length && ` ${comment.cocomments?.length}개`}
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

        {isExpanded && comment.cocomments?.length > 0 && (
          <div className="w-full flex flex-col gap-4">
            {comment.cocomments.map((childComment) => {
              return (
                <CocommentCard
                  key={childComment.cocommentsId}
                  parentCommentId={comment.commentId}
                  cocomment={childComment}
                  isOwner={true}
                  onUpdateCocomment={onUpdateComment}
                  onDeleteCocomment={onDeleteCocomment}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
