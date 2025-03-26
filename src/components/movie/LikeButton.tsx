import { Heart } from 'lucide-react';

interface LikeButtonProps {
  liked: boolean;
  onClick: () => void;
  size?: number;
}

const LikeButton = ({ liked, onClick, size = 30 }: LikeButtonProps) => {
  const baseStyle =
    'rounded-full flex items-center justify-center transition absolute top-[10px] right-[10px]';
  const bgColor = liked ? 'bg-cherry-blush' : 'bg-white/50';

  return (
    <button
      className={`${baseStyle} ${bgColor}`}
      style={{ width: size, height: size }}
      onClick={onClick}>
      <Heart fill="white" size={18} />
    </button>
  );
};

export default LikeButton;
