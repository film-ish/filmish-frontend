import { Star, Heart } from 'lucide-react';
import MoviePoster from './MoviePoster';

interface MovieCardProps {
  width?: number | string;
  poster: string;
  title: string;
  rating: number;
  genres: string[];
  runningTime: number;
  liked: boolean;
  onLike: () => void;
  iconType?: 'star' | 'heart';
}

const MovieCard = ({ 
  width = 225, 
  poster, 
  title, 
  genres, 
  runningTime, 
  rating, 
  liked, 
  onLike,
  iconType = 'star'
}: MovieCardProps) => {
  return (
    <div className="flex flex-col gap-[5px] min-w-[150px]" style={{ width: width }}>
      <div className="relative">
        <MoviePoster posterSrc={poster} liked={liked} onLike={onLike} />
      </div>

      <div className="flex items-center justify-between text-label-xl">
        <div className="font-semibold text-white">{title}</div>
        <div className="flex items-center gap-1 text-label-md font-light text-gray-4">
          {iconType === 'heart' ? (
            <Heart fill="#FF5E5E" size={14} strokeWidth={0} />
          ) : (
            <Star fill="#FF5E5E" size={14} strokeWidth={0} />
          )}
          {rating === 0 ? "0" : rating}
        </div>
      </div>

      <div className="flex items-center text-gray-4 text-label-md font-light">
        {genres} • {runningTime}분
      </div>
    </div>
  );
};

export default MovieCard;
