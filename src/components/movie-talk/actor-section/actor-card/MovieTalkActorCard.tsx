import { StarIcon } from "lucide-react";

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
    <div className="bg-[#2A2A2A] p-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative pb-[100%] mb-3 bg-[#383838] rounded-md overflow-hidden">
        <div className="absolute flex items-center justify-center w-full h-full">
          <span className="text-white text-sm">사진 100%</span>
        </div>
      </div>
      <div className="text-white">
        <p className="font-bold">{actor.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <StarIcon className="text-yellow-400 w-4 h-4 fill-yellow-400" />
          <span className="text-xs">{actor.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({actor.count})</span>
        </div>
      </div>
    </div>
  );
};

export default MovieTalkActorCard; 