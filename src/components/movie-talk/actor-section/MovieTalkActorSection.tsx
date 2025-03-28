import MovieTalkActorCard from "./actor-card/MovieTalkActorCard";

const MovieTalkActorSection = () => {
  // 실제 구현에서는 API에서 데이터를 가져오는 코드가 필요합니다
  const actors = [
    { id: 1, name: '김싸피', photoUrl: '', rating: 4.5, count: 15 },
    { id: 2, name: '김싸피', photoUrl: '', rating: 4.5, count: 15 },
    { id: 3, name: '김싸피', photoUrl: '', rating: 4.5, count: 15 },
    { id: 4, name: '김싸피', photoUrl: '', rating: 4.5, count: 15 },
    { id: 5, name: '김싸피', photoUrl: '', rating: 4.5, count: 15 },
    { id: 6, name: '김싸피', photoUrl: '', rating: 4.5, count: 15 },
    { id: 7, name: '김싸피', photoUrl: '', rating: 4.5, count: 15 },
    { id: 8, name: '김싸피', photoUrl: '', rating: 4.5, count: 15 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {actors.map(actor => (
        <MovieTalkActorCard key={actor.id} actor={actor} />
      ))}
    </div>
  );
};

export default MovieTalkActorSection; 