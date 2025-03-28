import MovieTalkMovingCard from "./card/MovieTalkMovingCard";

const CardSet = ({ isReverse = false }) => (
  <div className={`flex whitespace-nowrap ${isReverse ? 'animate-infiniteSlideDuplicate' : 'animate-infiniteSlideOriginal'}`}>
    {/* 첫 번째 세트 */}
    {Array.from({ length: 10 }, (_, index) => (
      <div key={`card-${index}`} className="px-[11px]">
        <MovieTalkMovingCard />
      </div>
    ))}
    {/* 두 번째 세트 */}
    {Array.from({ length: 10 }, (_, index) => (
      <div key={`card-duplicate-${index}`} className="px-[11px]">
        <MovieTalkMovingCard />
      </div>
    ))}
  </div>
);

const MovieTalkMoving = () => {
  return (
    <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden">
      <div className="flex relative py-3">
        <CardSet />
      </div>
      <div className="flex relative py-3">
        <CardSet isReverse />
      </div>
    </div>
  );
};
        
export default MovieTalkMoving;
    
