import { Star } from 'lucide-react';
import MoviePoster from './MoviePoster';

interface MovieCardProps {
  width?: number;
  posterSrc: string;
  title: string;
  rating: number;
  genre: string;
  runningTime: number;
  liked: boolean;
  onLike: () => void;
}

const MovieCard = ({ width = 225, posterSrc, title, genre, runningTime, rating, liked, onLike }: MovieCardProps) => {
  return (
    <div className="flex flex-col gap-[5px] min-w-[150px]" style={{ width: width }}>
      <div className="relative">
        <MoviePoster posterSrc={posterSrc} liked={liked} onLike={onLike} />
      </div>

      <div className="flex items-center justify-between text-label-xl">
        <div className="font-bold text-white">{title}</div>
        <div className="flex items-center">
          <Star fill="#FFE68A" size={14} strokeWidth={0} />
          {rating}
        </div>
      </div>

      <div className="flex items-center text-gray-3 text-label-md">
        {genre} • {runningTime}분
      </div>
    </div>
  );
};

export default MovieCard;
