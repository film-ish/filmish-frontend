import { FilmIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Actor {
  actorId: number;
  name: string;
  image?: string;
  indieCnt: number;
}

interface MovieTalkActorCardProps {
  actor: Actor;
  isCenter?: boolean;
  onCardClick?: () => void;
}

const MovieTalkActorCard = ({ actor, isCenter = false, onCardClick }: MovieTalkActorCardProps) => {
  const navigate = useNavigate();
  console.log(actor);
  
  const handleClick = () => {
    if (isCenter) {
      navigate(`/movie-talk/${actor.actorId}`);
    } else if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <div 
      className={`relative w-[400px] h-[550px] rounded-xl overflow-hidden shadow-xl cursor-pointer`}
      onClick={handleClick}
    >
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${actor.image || '/no-poster-long.png'})`,
        }}
      >
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* 배우 정보 */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <h3 className="text-3xl font-light mb-3">{actor.name}</h3>
        <div className="flex items-center gap-3">
          <FilmIcon className="w-4 h-4" />
          <span className="text-gray-3 text-xl">{actor.indieCnt}개 작품</span>
        </div>
      </div>
    </div>
  );
};

export default MovieTalkActorCard; 