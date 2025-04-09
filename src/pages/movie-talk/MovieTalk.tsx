import MovieTalkBanner from '../../components/movie-talk/banner/MovieTalkBanner';
import MovieTalkActorSection from '../../components/movie-talk/actor-section/MovieTalkActorSection';
import MovieTalkService from '../../components/movie-talk/service/MovieTalkService';
import MovieTalkPagination from '../../components/movie-talk/pagination/MovieTalkPagination';
import MovieTalkMoving from '../../components/movie-talk/moving-card/MovieTalkMoving';
import { useState, useEffect, useRef } from 'react';

const MovieTalk = () => {
  // 현재 페이지 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  // 배우 섹션 참조
  const actorSectionRef = useRef<HTMLDivElement>(null);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 배우 섹션으로 스크롤하는 함수
  const scrollToActorSection = () => {
    if (actorSectionRef.current) {
      actorSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 컴포넌트 마운트 시 페이지 상태 초기화
  useEffect(() => {
  }, []);

  return (
    <>
      <div>
        <img src="/1.png" alt="background" className='absolute bottom-40 left-30 w-50 h-full object-contain z-0' />
        <img src="/2.png" alt="background" className='absolute bottom-0 right-30 w-50 h-full object-contain z-0' />
        <MovieTalkBanner />
        <img src="/7.png" alt="background" className='absolute top-160 right-20 w-70 h-full object-contain z-0' />
        <div className="mb-8 mt-10">
          <MovieTalkMoving />
        </div>
        
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-bold text-center mt-20 mb-10">영화인 목록</h2>
        </div>
        <img src="/3.png" alt="background" className='absolute top-230 left-20 w-70 h-full object-contain z-0' />
        <img src="/4.png" alt="background" className='absolute top-370 right-30 w-60 h-full object-contain z-0' />
        <div ref={actorSectionRef} data-actor-section>
          <MovieTalkActorSection currentPage={currentPage} />
          <MovieTalkPagination 
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
        
        <MovieTalkService />
      </div>
    </>
  );
};

export default MovieTalk;
