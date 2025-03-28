import MovieTalkMovingCard from "./card/MovieTalkMovingCard";

const MovieTalkMoving = () => {
  return (
    <div className="flex gap-[22px]">
      {Array.from({ length: 4 }, (_, index) => (
        <MovieTalkMovingCard key={index} />
      ))}
    </div>
  );
};
        
export default MovieTalkMoving;
    
