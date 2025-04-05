import { FilmIcon } from "lucide-react";

interface Actor {
  id: number;
  name: string;
  photoUrl: string;
  rating: number;
  count: number;
}

interface MovieTalkActorCardProps {
  actor: Actor;
}

const MovieTalkActorCard = ({ actor }: MovieTalkActorCardProps) => {
  return (
    <div className="relative w-[400px] h-[550px] rounded-xl overflow-hidden shadow-xl">
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${actor.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'})`,
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
          <span className="text-gray-3 text-xl">{actor.count}개의 작품</span>
        </div>
      </div>
    </div>
  );
};

export default MovieTalkActorCard; 