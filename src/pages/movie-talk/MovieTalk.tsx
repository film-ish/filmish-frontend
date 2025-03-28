import MovieTalkBanner from "../../components/movie-talk/banner/MovieTalkBanner";
import MovieTalkActorSection from "../../components/movie-talk/actor-section/MovieTalkActorSection";
import MovieTalkService from "../../components/movie-talk/service/MovieTalkService";
import MovieTalkPagination from "../../components/movie-talk/pagination/MovieTalkPagination";
import MovieTalkMoving from "../../components/movie-talk/moving-card/MovieTalkMoving";

const MovieTalk = () => {
  return (
    <>
    <div className="pt-8">
      <MovieTalkBanner />
      <MovieTalkMoving />
      <h2 className="text-4xl font-bold text-center mt-25 mb-25">영화인 목록</h2>
      <MovieTalkActorSection />
      <MovieTalkPagination />
      <MovieTalkService />
    </div>
    </>
  );
};
  
export default MovieTalk;
