import { Film } from "lucide-react";

const MovieTalkMovingCard = () => {
  return (
    <div className="flex gap-[22px] items-center justify-start w-[405px] bg-gray-6 py-5 rounded-lg px-[24px]">
        <img className="w-[109px] h-[106px] rounded-lg" src="#" alt="#" />
        <div className="flex flex-col gap-[7px] items-start justify-start">
            <div className="flex bg-gray-8 items-center justify-center px-[10px] py-[5px] mr-auto rounded-lg">
                <span className="text-sm text-white">배우</span>
            </div>
            <h3 className="text-2xl font-bold">김싸피</h3>
            <div className="flex items-center gap-2">
                <Film />
                <span>15 작품</span>
            </div>
                <div className="flex bg-gray-5 items-center justify-center px-[16px] py-[4px] rounded-full">
                <span className="text-sm text-white">게시물 100개</span>
            </div>
        </div>
    </div>
  );
};
        
export default MovieTalkMovingCard;
    
