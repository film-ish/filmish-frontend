import { getTimeAgo } from '../../../../utils/date';
import ProfileImage from '../../../common/ProfileImage';

interface ReviewCardProps {
  review: {
    title: string;
    content: string;
    updatedAt: string;
    createdAt: string;
    rating: number;
    writerName: string;
    writerImage: string;
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="h-full bg-white/10 rounded-xl p-6 flex flex-col transition-colors">
      <h3 className="text-lg font-bold mb-2 text-white line-clamp-1">{review.title}</h3>
      <p className="text-sm text-gray-4 line-clamp-2 mb-auto">{review.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProfileImage size={24} src={review.writerImage} />
          <span className="text-xs font-semibold text-gray-4">{review.writerName}</span>
        </div>
        <span className="text-xs font-light text-gray-4">{getTimeAgo(review.updatedAt || review.createdAt)}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
