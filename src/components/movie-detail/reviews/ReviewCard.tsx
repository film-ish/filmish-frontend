import { Link } from 'react-router';
import Review from '../../../types/review';
import ProfileImage from '../../common/ProfileImage';
import { getTimeAgo } from '../../../utils/date';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Link
      to={review.id.toString()}
      viewTransition
      className="w-full flex items-center gap-4"
      style={{ contentVisibility: 'auto' }}>
      {review.images.length > 0 && (
        <div className="shrink-0 w-[100px] h-fit aspect-square relative flex items-center justify-center rounded-[10px] overflow-hidden">
          <img className="w-full h-full object-cover" src={review.images[0]} alt="review thumbnail" />
        </div>
      )}

      <div className="w-full max-h-[120px] flex flex-col gap-2 overflow-hidden">
        <div className="text-label-lg font-bold truncate">{review.title}</div>
        <div className="text-paragraph-md line-clamp-2 text-ellipsis whitespace-normal break-words overflow-hidden">
          {review.content}
        </div>

        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ProfileImage size={30} src={review.writerImage} />
            <div className="text-label-md">{review.writerName}</div>
          </div>
          <div className="text-label-sm text-gray-4">{getTimeAgo(review.updatedAt || review.createdAt)}</div>
        </div>
      </div>
    </Link>
  );
};

export default ReviewCard;
