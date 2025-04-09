import { useState, useRef, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FilmIcon } from 'lucide-react';
import MovieTalkActorCard from "./actor-card/MovieTalkActorCard";
import { useQuery } from '@tanstack/react-query';
import { getActors, searchActor } from '../../../api/actor/getActor';
import ActorSearch from './ActorSearch';

interface MovieTalkActorSectionProps {
  currentPage?: number;
}

const MovieTalkActorSection = ({ currentPage = 1 }: MovieTalkActorSectionProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: false,
    dragFree: true,
    loop: false,
    startIndex: 4,
    skipSnaps: false,
    active: true,
    inViewThreshold: 0.7,
  });
  const [centerIndex, setCenterIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  // 검색 결과 가져오기 (2글자 이상일 때만 검색 실행)
  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['actors', 'search', searchTerm],
    queryFn: async () => {
      console.log('검색어:', searchTerm);
      const results = await searchActor(searchTerm);
      console.log('검색 결과:', results);
      return results;
    },
    enabled: searchTerm.length >= 2,
    staleTime: 1000 * 60 * 60, // 1시간
  });

  // 페이지에 따른 배우 데이터 가져오기
  const { data: actors, isLoading } = useQuery({
    queryKey: ['actors', currentPage - 1],
    queryFn: async () => {
      const results = await getActors(currentPage - 1, pageSize);
      console.log('페이지 배우 데이터:', results);
      return results;
    },
    staleTime: 1000 * 60 * 60, // 1시간
  });

  // 캐러셀 이벤트 설정
  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        const selectedIndex = emblaApi.selectedScrollSnap();
        setCenterIndex(selectedIndex);
      };

      emblaApi.on('select', onSelect);
      emblaApi.scrollTo(4);
      onSelect();

      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi]);

  // 페이지가 변경되면 캐러셀 초기화
  useEffect(() => {
    if (emblaApi) {
      setTimeout(() => {
        emblaApi.scrollTo(4);
        setCenterIndex(4);
        emblaApi.reInit();
      }, 100);
    }
  }, [currentPage, emblaApi, searchResults]);

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

  const handleSlideClick = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
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

  if (isSearchLoading && searchTerm.length >= 2) {
    return (
      <div className="relative w-full mx-auto px-4">
        <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden px-4">
          <div className="absolute top-10 right-4 flex gap-4 z-10 mr-[120px]">
            <ActorSearch onSearch={setSearchTerm} />
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
          <div className="flex justify-center items-center py-20">
            <p className="text-white">검색 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (searchTerm.length >= 2 && (!searchResults || searchResults.length === 0)) {
    return (
      <div className="relative w-full mx-auto px-4">
        <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden px-4">
          <div className="absolute top-10 right-4 flex gap-4 z-10 mr-[120px]">
            <ActorSearch onSearch={setSearchTerm} />
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
          <div className="flex justify-center items-center py-40">
            <p className="text-white text-xl">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  const displayActors = searchTerm.length >= 2 && searchResults ? searchResults : actors;

  return (
    <div className="relative w-full mx-auto px-4">
      <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden px-4">
        <div className="absolute top-10 right-4 flex gap-4 z-10 mr-[120px]">
          <ActorSearch onSearch={setSearchTerm} />
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
            className="embla overflow-hidden pt-[100px]"
          >
            <div className="embla__container flex" style={{ 
              paddingLeft: 'calc(50% - 200px)', 
              paddingRight: 'calc(50% - 200px)',
              gap: '1.5rem'
            }}>
              {displayActors && displayActors.length > 0 ? (
                displayActors.map((actor: any, index: number) => (
                  <div 
                    key={`actor-${actor.id}-${index}`} 
                    className={`embla__slide relative flex-[0_0_400px] actor-card ${index === centerIndex ? 'center' : ''}`}
                    data-index={index}
                  >
                    <MovieTalkActorCard 
                      actor={actor} 
                      isCenter={index === centerIndex} 
                      onCardClick={() => handleSlideClick(index)}
                    />
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
                ))
              ) : (
                <div className="flex justify-center items-center w-full py-20">
                  <p className="text-white">표시할 배우 정보가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieTalkActorSection; 