import { Film } from 'lucide-react';

interface Actor {
  id: number;
  name: string;
  photoUrl: string;
  rating: number;
  qnaCnt: number;
  indieCnt: number;
  role: string;
}

interface MovieTalkMovingCardProps {
  actor: Actor;
}

const MovieTalkMovingCard = ({ actor }: MovieTalkMovingCardProps) => {
  return (
    <div className="flex gap-[22px] items-center justify-start w-[405px] bg-white/10 py-5 rounded-lg px-[24px] backdrop-blur-xs">
      <img
        className="w-[109px] h-[106px] rounded-lg bg-gray-7 object-cover border border-gray-5"
        src={actor.photoUrl || '/no-poster-long.png'}
        alt={`${actor.name}의 프로필 이미지`}
      />
      <div className="flex flex-col gap-1 items-start justify-start">
        <div className="flex bg-gray-8 items-center justify-center px-[10px] py-[5px] mr-auto rounded-lg">
          <span className="text-sm text-white">
            {actor.role === 'ACTOR'
              ? '배우'
              : actor.role === 'DIRECTOR'
                ? '감독'
                : actor.role === 'ACTORANDDIRECTOR'
                  ? '배우 및 감독'
                  : actor.role}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-white">{actor.name}</h3>
        <div className="flex items-center gap-2 text-white">
          <Film className="w-4 h-4" />
          <span>{actor.indieCnt} 작품</span>
        </div>
        <div className="flex bg-gray-5 items-center justify-center px-[16px] py-[4px] rounded-full">
          <span className="text-sm text-white">게시물 {actor.qnaCnt}개</span>
        </div>
      </div>
    </div>
  );
};

export default MovieTalkMovingCard;
