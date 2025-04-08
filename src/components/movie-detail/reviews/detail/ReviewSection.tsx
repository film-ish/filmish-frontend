import { useEffect, useState } from 'react';
import IconButton from '../../../common/IconButton';
import { Check, Eye, MoreHorizontal } from 'lucide-react';
import { getKoreanDate } from '../../../../utils/date';
import ProfileImage from '../../../common/ProfileImage';
import Menu from '../../common/Menu';
import Review from '../../../../types/review';

interface ReviewSectionProps {
  review: Review;
  updateReview: (review: Review) => void;
  deleteReview: () => void;
}

const ReviewSection = ({ review, updateReview, deleteReview }: ReviewSectionProps) => {
  const isOwner = true;

  const [editedReview, setEditedReview] = useState({ title: '', content: '' });

  useEffect(() => {
    setEditedReview({
      title: review?.title,
      content: review?.content,
    });
  }, [review]);

  const onClickDone = () => {
    setIsEditing(false);
    updateReview({ title: editedReview.title, content: editedReview.content });
  };

  const [isEditing, setIsEditing] = useState(false);
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
        deleteReview();
      },
    },
  ];

  return (
    <div className="flex gap-4 align-top justify-between">
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="text-heading-md">
            {isEditing ? (
              <input
                className={
                  'w-full border-b-[1px] focus:outline-none focus:ring-0 focus:border-b-[1px] focus:border-b-white' +
                  (editedReview.title ? ' border-b-white' : ' border-b-gray-4')
                }
                type="text"
                placeholder="제목을 입력하세요."
                value={editedReview.title}
                onChange={(e) => setEditedReview({ ...editedReview, title: e.target.value })}
              />
            ) : (
              review.title
            )}
          </div>

          {isOwner && (
            <div className="relative">
              {showMoreActions && (
                <Menu hasRightSpace={false} items={moreActionItems} closeMenu={() => setShowMoreActions(false)} />
              )}

              {isEditing ? (
                <IconButton className="shrink-0" size={30} onClick={onClickDone}>
                  <Check size={20} />
                </IconButton>
              ) : (
                <IconButton className="shrink-0" size={30} onClick={() => setShowMoreActions(!showMoreActions)}>
                  <MoreHorizontal size={20} />
                </IconButton>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-label-sm text-gray-4">
          <div>{getKoreanDate(review.createdAt)}</div>
          <div className="flex items-center gap-1">
            <Eye size={16} /> {review.views.toLocaleString()} views
          </div>
        </div>

        <div className="flex items-center gap-2 text-label-sm font-bold">
          <ProfileImage src={review.writerImage} size={30} />
          <div>{review.writerName}</div>
        </div>

        <div className="h-full text-paragraph-md">
          {isEditing ? (
            <textarea
              className="w-full min-h-full border-2 border-gray-0 p-2 rounded-[10px]"
              value={editedReview.content}
              onChange={(e) => setEditedReview({ ...editedReview, content: e.target.value })}
            />
          ) : (
            review.content
          )}
        </div>
      </div>

      {review.images?.length > 0 && (
        <div className="w-[200px] shrink-0 aspect-[1/1.3] rounded-[10px] overflow-hidden">
          <img className="object-cover w-full h-full" src={review.images[0]} alt="review image" />
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
