import MovieTalkBanner from "../../components/movie-talk/banner/MovieTalkBanner";
import MovieTalkActorSection from "../../components/movie-talk/actor-section/MovieTalkActorSection";
import MovieTalkService from "../../components/movie-talk/service/MovieTalkService";
import MovieTalkPagination from "../../components/movie-talk/pagination/MovieTalkPagination";
import MovieTalkMoving from "../../components/movie-talk/moving-card/MovieTalkMoving";

const MovieTalk = () => {
  return (
    <div className="py-8">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <MovieTalkBanner />
      </div>
      
      {/* Full width section */}
      <div className="-mx-[100vw] px-[100vw] relative left-1/2 right-1/2">
        <MovieTalkMoving />
      </div>

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-2xl font-bold text-center mt-8">영화인 목록</h2>
        <MovieTalkActorSection />
        <MovieTalkPagination />
        <MovieTalkService />
      </div>
    </div>
  );
};
  
export default MovieTalk;
