import { MoreHorizontal } from 'lucide-react';
import IconButton from '../../../common/IconButton';
import ProfileImage from '../../../common/ProfileImage';
import { useState } from 'react';
import Menu from '../../common/Menu';

interface CocomentCardProps {
  parentCommentId?: number;
  cocomment: ReviewComment;
  isOwner: boolean;
  onDeleteCocomment: (input: { cocommentsId: number }) => void;
  onUpdateCocomment: (input: { commentId: number; content: string }) => void;
}

const CocommentCard = ({ cocomment, isOwner, onDeleteCocomment, onUpdateCocomment }: CocomentCardProps) => {
  const [showMoreActions, setShowMoreActions] = useState(false);

  const moreActionItems = [
    {
      name: '수정',
      onClick: () => {
        onUpdateCocomment({ commentId: cocomment.cocommentsId, content: '수정된 댓글 내용' });
        setShowMoreActions(false);
      },
    },
    {
      name: '삭제',
      onClick: () => {
        onDeleteCocomment({ cocommentsId: cocomment.cocommentsId });
        setShowMoreActions(false);
      },
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex items-start justify-between">
        <div className={`flex items-start gap-2`}>
          <ProfileImage src={cocomment.cocommentWriterImage} />
          <div className="flex flex-col">
            <div className="text-label-md font-bold">{cocomment.cocommentWriterName}</div>
            {cocomment.content && <div className="text-paragraph-md">{cocomment.content}</div>}
          </div>
        </div>
        {isOwner && (
          <div>
            {showMoreActions && <Menu items={moreActionItems} closeMenu={() => setShowMoreActions(false)} />}
            <IconButton className="shrink-0" size={30} onClick={() => setShowMoreActions(!showMoreActions)}>
              <MoreHorizontal size={20} />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default CocommentCard;
