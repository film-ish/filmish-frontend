import { Star, Heart } from 'lucide-react';
import MoviePoster from './MoviePoster';

export interface Movie {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  likes: number;
  genres: string[] | string;
  runningTime: number;
  pubDate: string;
}

interface MovieCardProps {
  width?: number | string;
  movie: Movie;
  isLoggedIn: boolean;
  iconType?: 'star' | 'heart';
}

const MovieCard = ({
  width = 225,
  movie,
  isLoggedIn,
  iconType = 'star'
}: MovieCardProps) => {
  if (!movie) {
    return null;
  }

  const { title, posterPath, rating, genres, runningTime } = movie;
  
  // genres가 문자열 배열인 경우 문자열로 변환
  const genresText = Array.isArray(genres) ? genres.join(', ') : genres;

  return (
    <div className="flex flex-col gap-[5px] min-w-[150px]" style={{ width: width }}>
      <div className="relative">
        <MoviePoster posterSrc={posterPath} liked={false} onLike={() => {}} />
      </div>

      <div className="flex items-center justify-between text-label-xl">
        <div className="font-semibold text-white">{title}</div>
        <div className="flex items-center gap-1 text-label-md font-light text-gray-4">
          {iconType === 'heart' ? (
            <>
              <Heart fill="#FF5E5E" size={14} strokeWidth={0} />
              {rating == 0 ? 0 : rating}
            </>
          ) : (
            <>
              <Star fill="#FF5E5E" size={14} strokeWidth={0} />
              {rating == 0 ? 0 : rating?.toFixed(1)}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center text-gray-4 text-label-md font-light">
        {genresText}{runningTime > 0 ? ` • ${runningTime}분` : ''}
      </div>
    </div>
  );
};

export default MovieCard;
