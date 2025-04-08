import LikeButton from './LikeButton';

interface MoviePosterProps {
  posterSrc: string;
  width?: number;
  liked?: boolean;
  onLike?: () => void;
}

const MoviePoster = ({ posterSrc, width, liked, onLike }: MoviePosterProps) => {
  return (
    <div
      className="relative w-full rounded-[10px] overflow-hidden aspect-[1/1.42] flex items-center justify-center"
      style={{ width: width }}>
      <img
        className="object-cover h-full"
        src={posterSrc ? posterSrc : '/public/no-poster-long.png'}
        alt="poster image"
      />
      {liked !== undefined && onLike && <LikeButton liked={liked} onClick={onLike} />}
    </div>
  );
};

export default MoviePoster;
