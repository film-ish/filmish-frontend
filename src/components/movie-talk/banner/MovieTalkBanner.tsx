import MovieTalkBannerButton from "./banner-button/MovieTalkBannerButton";

const MovieTalkBanner = () => {
    return (
      <div className="flex flex-col my-[80px] py-auto gap-4 items-center justify-center bg-white/15 backdrop-blur-xs rounded-2xl text-white relative">
        <div className="z-10 flex flex-col items-center w-full my-[80px]">
          <h1 className="text-[60px] font-bold mb-[10px]">영화인<span className="text-gray-6 text-[63px]" style={{ WebkitTextStroke: '0.3px #fff' }}>과의 대화를 시작하세요</span></h1>
          <h3 className="text-[30px] font-semibold mb-[20px] text-center">독립 영화 팬이라면, 좋아하는 배우나 감독을 더 깊이 알아가고 싶지 않나요?</h3>
          <p className="text-[20px] text-center mb-1">우리 서비스의 배우 프로필 & 팬 커뮤니티는 독립 영화 중심 배우 정보 제공과 팬들과의 교류 공간을 지원합니다.</p>
          <p className="text-[20px] mb-[50px] text-center">배우 프로필에서 출연작 정보를 확인하고, 팬 게시판에서 다른 팬들과 이야기할 수 있어요!</p>
          <MovieTalkBannerButton />
        </div>
      </div>
    );
  };    

export default MovieTalkBanner;
