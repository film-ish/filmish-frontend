import { useState, useRef, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FilmIcon } from 'lucide-react';
import MovieTalkActorCard from "./actor-card/MovieTalkActorCard";
import { useQuery } from '@tanstack/react-query';
import { getActors } from '../../../api/actor/getActor';

interface MovieTalkActorSectionProps {
  currentPage?: number;
}

const MovieTalkActorSection = ({ currentPage = 1 }: MovieTalkActorSectionProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: false,
    dragFree: true,
    loop: false,
    startIndex: 0,
    skipSnaps: false,
    active: true,
    inViewThreshold: 0.7,
  });
  const [centerIndex, setCenterIndex] = useState(0);
  const pageSize = 10;

  // 페이지에 따른 배우 데이터 가져오기
  const { data: actors, isLoading } = useQuery({
    queryKey: ['actors', currentPage - 1], // API는 0부터 시작하므로 1을 빼줌
    queryFn: () => getActors(currentPage - 1, pageSize),
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 캐러셀 이벤트 설정
  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        const selectedIndex = emblaApi.selectedScrollSnap();
        setCenterIndex(selectedIndex);
      };

      emblaApi.on('select', onSelect);
      onSelect(); // 초기 선택 상태 설정

      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi]);

  // 페이지가 변경되면 캐러셀 초기화
  useEffect(() => {
    if (emblaApi) {
      // 페이지 변경 시 캐러셀 초기화
      setTimeout(() => {
        emblaApi.scrollTo(0);
        setCenterIndex(0);
        emblaApi.reInit();
      }, 100);
    }
  }, [currentPage, emblaApi]);

  const handlePrevClick = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  };

  const handleNextClick = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  };

  if (isLoading) {
    return (
      <div className="relative w-full mx-auto px-4">
        <div className="flex justify-center items-center py-20">
          <p className="text-white">배우 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!actors || actors.length === 0) {
    return (
      <div className="relative w-full mx-auto px-4">
        <div className="flex justify-center items-center py-20">
          <p className="text-white">표시할 배우 정보가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto px-4">
      <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden px-4">
        <div className="absolute top-10 right-4 flex gap-4 z-10 mr-[120px]">
          <button className="p-2 rounded-full bg-gray-7 hover:bg-gray-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button 
            onClick={handlePrevClick}
            className="p-2 rounded-full bg-gray-7 hover:bg-gray-6"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={handleNextClick}
            className="p-2 rounded-full bg-gray-7 hover:bg-gray-6"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <div
            ref={emblaRef}
            className="embla overflow-hidden pt-[100px] pb-[10px] mb-[30px]"
          >
            <div className="embla__container flex" style={{ 
              paddingLeft: 'calc(50% - 200px)', 
              paddingRight: 'calc(50% - 200px)',
              gap: '1.5rem'
            }}>
              {actors.map((actor: any, index: number) => (
                <div 
                  key={`actor-${actor.id}-${index}`} 
                  className={`embla__slide relative flex-[0_0_400px] actor-card ${index === centerIndex ? 'center' : ''}`}
                  data-index={index}
                >
                  <MovieTalkActorCard actor={actor} />
                  <div 
                    className={`mt-4 transition-all duration-300 ${
                      index === centerIndex 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center gap-2 mt-1">
                      <h3 className="text-3xl font-light">{actor.name}</h3>
                      <div className="flex items-center gap-1">
                        <FilmIcon className="w-4 h-4" />
                        <span className="text-sm">{actor.indieCnt}개 작품</span>
                      </div>
                    </div>
                    <span className="text-2xl font-light text-gray-5">작품: [{actor.movieTitle}]...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieTalkActorSection; 