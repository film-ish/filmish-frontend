import { StarIcon } from "lucide-react";  

interface MovieInfoProps {
  title: string;
  rating: number;
  onDetailClick: () => void;
}

const MovieInfo = ({ title, rating, onDetailClick }: MovieInfoProps) => {
  return (
    <div className="absolute bottom-5 left-0 right-0 py-10 px-20">
      <h3 className="text-white text-3xl font-bold mb-2">{title}</h3>
      <div className="flex flex-col items-start justify-between gap-4">
        <div className="flex items-center">
          <StarIcon size={20} color="#ff5e5e" fill="#ff5e5e" className="mr-1" />   
          <span className="text-white">{rating.toFixed(1)}</span>
        </div>
        <button
          onClick={onDetailClick}
          className="px-5 py-2 bg-gray-2 bg-opacity-20 text-gray-6 font-bold rounded-full hover:bg-opacity-30 transition-all"
        >
          자세히 보기
        </button>
      </div>
    </div>
  );
};

export default MovieInfo; 