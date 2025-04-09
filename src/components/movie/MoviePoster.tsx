import { useEffect, useState } from 'react';
import LikeButton from './LikeButton';

interface MoviePosterProps {
  posterSrc: string;
  width?: number;
  liked?: boolean;
  onLike?: () => void;
}

const MoviePoster = ({ posterSrc, width, liked, onLike }: MoviePosterProps) => {
  const [likedState, setLikedState] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    setLikedState(liked);
  }, [liked]);

  const onClickLike = () => {
    setLikedState(!likedState);
    onLike?.();
  };

  return (
    <div
      className="bg-gray-8 relative w-full rounded-[10px] overflow-hidden aspect-[1/1.42] flex items-center justify-center"
      style={{ width: width }}>
      <img
        className="object-cover h-full"
        src={posterSrc ? posterSrc : '/no-poster-long.png'}
        alt="poster image"
      />
      {likedState !== undefined && onLike && <LikeButton liked={likedState} onClick={onClickLike} />}
    </div>
  );
};

export default MoviePoster;
