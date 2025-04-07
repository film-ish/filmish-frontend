import MovieTalkBanner from '../../components/movie-talk/banner/MovieTalkBanner';
import MovieTalkActorSection from '../../components/movie-talk/actor-section/MovieTalkActorSection';
import MovieTalkService from '../../components/movie-talk/service/MovieTalkService';
import MovieTalkPagination from '../../components/movie-talk/pagination/MovieTalkPagination';
import MovieTalkMoving from '../../components/movie-talk/moving-card/MovieTalkMoving';
import { useState, useEffect } from 'react';

const MovieTalk = () => {
  // 현재 페이지 상태 관리
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 컴포넌트 마운트 시 페이지 상태 초기화
  useEffect(() => {
  }, []);

  return (
    <>
      <div>
        <MovieTalkBanner />
        
        <div className="mb-8 mt-10">
          <h2 className="text-2xl font-bold text-center mb-8">인기 영화인</h2>
          <MovieTalkMoving />
        </div>
        
        <h2 className="text-4xl font-bold text-center mt-25 mb-25">영화인 목록</h2>
        <MovieTalkActorSection currentPage={currentPage} />
        <MovieTalkPagination 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
        />
        <MovieTalkService />
      </div>
    </>
  );
};

export default MovieTalk;
