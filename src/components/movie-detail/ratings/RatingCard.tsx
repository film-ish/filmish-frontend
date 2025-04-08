import { Star, StarHalf } from 'lucide-react';
import ProfileImage from '../../common/ProfileImage';
import { getKoreanDate } from '../../../utils/date';

interface RatingProps {
  id: number;
  writerImage: string;
  writerName: string;
  value: number;
  content: string;
  createdAt: string;
}

const RatingCard = ({ comment }: RatingProps) => {
  return (
    <div key={comment.id} className="flex items-center gap-2">
      <ProfileImage src={comment.writerImage} />

      <div className="w-full flex flex-col">
        <div className="flex">
          {comment.value &&
            new Array(Math.ceil(Number(comment.value))).fill(0).map((_, index) => {
              if (!Number.isInteger(Number(comment.value)) && index === Math.ceil(Number(comment.value)) - 1) {
                return <StarHalf className="fill-rose-cloud" key={index} size={12} stroke={0} />;
              }
              return <Star className="fill-rose-cloud" key={index} size={12} stroke={0} />;
            })}
        </div>
        <div className="text-label-md font-bold">{comment.writerName}</div>
        <div className="text-paragraph-md">{comment.content}</div>
      </div>

      <div className="text-gray-4 text-paragraph-sm whitespace-nowrap self-end content-end">
        {getKoreanDate(comment.createdAt)}
      </div>
    </div>
  );
};

export default RatingCard;
