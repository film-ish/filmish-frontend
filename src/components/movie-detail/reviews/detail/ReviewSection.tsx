import { useEffect, useRef, useState } from 'react';
import IconButton from '../../../common/IconButton';
import { Check, Eye, MoreHorizontal } from 'lucide-react';
import { getTimeAgo } from '../../../../utils/date';
import ProfileImage from '../../../common/ProfileImage';
import Menu from '../../common/Menu';
import Review from '../../../../types/review';
import { useUserStore } from '../../../../store/userStore';
import ImageViewer from '../ReviewImageViewer';

interface ReviewSectionProps {
  review: Review;
  updateReview: (review: Review) => void;
  deleteReview: () => void;
}

const ReviewSection = ({ review, updateReview, deleteReview }: ReviewSectionProps) => {
  const user = useUserStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editedReview, setEditedReview] = useState({ title: '', content: '' });
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
        if (confirm('정말 삭제하시겠습니까?')) {
          setShowMoreActions(false);
          deleteReview();
        }
      },
    },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedReview({
      title: review?.title,
      content: review?.content,
    });
  }, [review]);

  const onClickDone = () => {
    setIsEditing(false);

    if (editedReview.title.trim() === review.title.trim() && editedReview.content.trim() === review.content.trim()) {
      return;
    }

    updateReview({ title: editedReview.title.trim(), content: editedReview.content.trim() });
  };

  const onChangeReviewTitle = (e) => {
    if (e.target.value.length > 20) {
      alert('제목은 20자 이내로 작성해주세요.');
      return;
    }

    setEditedReview({ ...editedReview, title: e.target.value });
  };

  const onChangeReviewContent = (e) => {
    if (e.target.value.length > 255) {
      alert('내용은 255자 이내로 작성해주세요.');
      return;
    }

    if (textareaRef.current) {
      requestAnimationFrame(() => {
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      });
    }

    setEditedReview({ ...editedReview, content: e.target.value });
  };

  const [imageViewerState, setImageViewerState] = useState(false);

  return (
    <>
      {imageViewerState && <ImageViewer images={review?.images} handleClose={() => setImageViewerState(false)} />}

      <div className="flex gap-4 items-start justify-between">
        <div className="w-full min-w-0 flex-1 flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 break-words text-label-xl font-bold">
                {isEditing ? (
                  <input
                    className={
                      'w-full border-b-[1px] focus:outline-none focus:ring-0 focus:border-b-[1px] focus:border-b-white' +
                      (editedReview.title ? ' border-b-white' : ' border-b-gray-4')
                    }
                    type="text"
                    placeholder="제목을 입력하세요. (최대 20자)"
                    value={editedReview.title}
                    onChange={onChangeReviewTitle}
                  />
                ) : (
                  review.title
                )}
              </div>

              {review.writerName === user.nickname && (
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
              <div>{getTimeAgo(review.updatedAt || review.createdAt)}</div>
              <div className="flex items-center gap-1">
                <Eye size={16} /> {review.views < 1000000 ? review.views.toLocaleString() : '1,000,000+'} views
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="min-w-0 flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-label-md font-bold">
                <ProfileImage src={review.writerImage} size={30} />
                <div>{review.writerName}</div>
              </div>

              <div className="h-full text-paragraph-md">
                {isEditing ? (
                  <textarea
                    ref={textareaRef}
                    className="w-full text-label-md border-[1px] border-gray-4 rounded-[5px] p-1 resize-none overflow-y-hidden"
                    placeholder="내용을 입력하세요. (최대 255자)"
                    value={editedReview.content}
                    onChange={onChangeReviewContent}
                  />
                ) : (
                  <span className="whitespace-pre-line break-words max-w-full overflow-hidden">{review.content}</span>
                )}
              </div>
            </div>

            {review.images?.length > 0 && (
              <div
                onClick={() => setImageViewerState(true)}
                className="w-[200px] shrink-0 aspect-[1/1.3] rounded-[10px] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img className="object-cover w-full h-full" src={review.images[0]} alt="review image" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewSection;
