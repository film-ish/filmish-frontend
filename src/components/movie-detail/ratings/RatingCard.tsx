import { Star, StarHalf } from 'lucide-react';
import ProfileImage from '../../common/ProfileImage';
import { getTimeAgo } from '../../../utils/date';
import { useUserStore } from '../../../store/userStore';

interface Rating {
  id: number;
  writerImage: string;
  writerName: string;
  value: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface RatingCardProps {
  comment: Rating;
  onClickEdit: () => void;
  onClickDelete: () => void;
}

const RatingCard = ({ comment, onClickEdit, onClickDelete }: RatingCardProps) => {
  const user = useUserStore();

  return (
    <div key={comment.id} className="flex items-center gap-2">
      <ProfileImage src={comment.writerImage} />

      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex">
            {comment.value &&
              new Array(Math.ceil(Number(comment.value))).fill(0).map((_, index) => {
                if (!Number.isInteger(Number(comment.value)) && index === Math.ceil(Number(comment.value)) - 1) {
                  return <StarHalf className="fill-rose-cloud" key={index} size={12} stroke={0} />;
                }
                return <Star className="fill-rose-cloud" key={index} size={12} stroke={0} />;
              })}
          </div>

          <div className="flex flex-col gap-2 justify-between items-end h-full text-gray-4 text-paragraph-sm whitespace-nowrap">
            {comment.writerName === user.nickname && (
              <div className="flex gap-2">
                <button
                  onClick={onClickEdit}
                  className="self-end text-sm text-gray-4 hover:text-white transition-colors">
                  수정
                </button>

                {/* <button
                  onClick={onClickDelete}
                  className="self-end text-sm text-gray-4 hover:text-white transition-colors">
                  삭제
                </button> */}
              </div>
            )}
          </div>
        </div>

        <div className="text-label-md font-bold">{comment.writerName}</div>
        <div className="flex items-center justify-between text-paragraph-md">
          <span>{comment.content}</span>

          <div className="flex flex-col gap-2 justify-between items-end h-full text-gray-4 text-paragraph-sm whitespace-nowrap">
            {getTimeAgo(comment.updatedAt || comment.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
