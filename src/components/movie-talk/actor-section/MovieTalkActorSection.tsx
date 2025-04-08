import { useState, useRef, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FilmIcon, Search, X } from 'lucide-react';
import MovieTalkActorCard from "./actor-card/MovieTalkActorCard";
import { useQuery } from '@tanstack/react-query';
import { getActors, searchActor } from '../../../api/actor/getActor';

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
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pageSize = 10;
  const [isComposing, setIsComposing] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSearchRendered, setIsSearchRendered] = useState(false);

  // 디바운스 효과 적용 (검색어 입력 후 500ms 후에 검색 실행)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 검색창 표시/숨김 토글 시 애니메이션 처리
  useEffect(() => {
    if (isSearchVisible) {
      // 검색창이 표시되면 먼저 렌더링하고 약간의 지연 후 확장 애니메이션 시작
      setIsSearchRendered(true);
      const timer = setTimeout(() => {
        setIsSearchExpanded(true);
      }, 50);
      return () => clearTimeout(timer);
    } else if (isClosing) {
      // 검색창이 닫히는 중이면 축소 애니메이션 후 완전히 숨김
      const timer = setTimeout(() => {
        setIsSearchExpanded(false);
        // 애니메이션이 끝난 후 렌더링 상태 해제
        setTimeout(() => {
          setIsSearchRendered(false);
          setIsClosing(false);
        }, 300);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchVisible, isClosing]);

  // 검색창 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchVisible && 
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        // 즉시 숨기지 않고 애니메이션 후 숨김
        setIsClosing(true);
        // 애니메이션이 끝난 후 검색창 숨김
        setTimeout(() => {
          setIsSearchVisible(false);
        }, 350);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchVisible]);

  // 검색창 표시/숨김 토글
  const toggleSearch = () => {
    if (isSearchVisible) {
      // 검색창이 열려있으면 닫기 애니메이션 시작
      setIsClosing(true);
      // 애니메이션이 끝난 후 검색창 숨김
      setTimeout(() => {
        setIsSearchVisible(false);
      }, 350);
    } else {
      // 검색창이 닫혀있으면 표시
      setIsSearchVisible(true);
    }
    
    if (!isSearchVisible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 한글 입력 시작 시 호출
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // 한글 입력 완료 시 호출
  const handleCompositionEnd = () => {
    setIsComposing(false);
    // 입력이 완료된 후 검색어 업데이트
    if (searchInputRef.current) {
      setSearchTerm(searchInputRef.current.value);
    }
  };

  // 검색어 초기화
  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // 검색 결과 가져오기 (2글자 이상일 때만 검색 실행)
  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['actors', 'search', debouncedSearchTerm],
    queryFn: async () => {
      console.log('검색어:', debouncedSearchTerm);
      const results = await searchActor(debouncedSearchTerm);
      console.log('검색 결과:', results);
      return results;
    },
    enabled: debouncedSearchTerm.length >= 2 && !isComposing, // 2글자 이상이고 한글 입력 중이 아닐 때만 검색 실행
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 페이지에 따른 배우 데이터 가져오기
  const { data: actors, isLoading } = useQuery({
    queryKey: ['actors', currentPage - 1], // API는 0부터 시작하므로 1을 빼줌
    queryFn: async () => {
      const results = await getActors(currentPage - 1, pageSize);
      console.log('페이지 배우 데이터:', results);
      return results;
    },
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
      console.log(searchResults);
      // 페이지 변경 시 캐러셀 초기화
      setTimeout(() => {
        emblaApi.scrollTo(0);
        setCenterIndex(0);
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

  // 특정 슬라이드로 이동하는 함수
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

  // 검색 중일 때 로딩 표시 (2글자 이상일 때만)
  if (isSearchLoading && debouncedSearchTerm.length >= 2) {
    return (
      <div className="relative w-full mx-auto px-4">
        <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden px-4">
          <div className="absolute top-10 right-4 flex gap-4 z-10 mr-[120px]">
            <div 
              ref={searchContainerRef}
              className={`flex items-center bg-gray-6 rounded-full px-4 py-2 shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
                isSearchExpanded ? 'w-[300px]' : 'w-[40px]'
              }`}
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="배우 이름 검색..."
                className={`outline-none bg-transparent text-gray-800 transition-all duration-300 ${
                  isSearchExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className={`text-gray-500 hover:text-gray-700 ml-2 transition-all duration-300 ${
                    isSearchExpanded ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
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

  // 검색 결과가 없을 때 빈 화면 표시 (2글자 이상일 때만)
  if (debouncedSearchTerm.length >= 2 && (!searchResults || searchResults.length === 0)) {
    return (
      <div className="relative w-full mx-auto px-4">
        <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden px-4">
          <div className="absolute top-10 right-4 flex gap-4 z-10 mr-[120px]">
            <div 
              ref={searchContainerRef}
              className={`flex items-center bg-gray-6 rounded-full px-4 py-2 shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
                isSearchExpanded ? 'w-[300px]' : 'w-[40px]'
              }`}
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="배우 이름 검색..."
                className={`outline-none bg-transparent text-gray-800 transition-all duration-300 ${
                  isSearchExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className={`text-gray-500 hover:text-gray-700 ml-2 transition-all duration-300 ${
                    isSearchExpanded ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
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
            <p className="text-white text-xl">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  // 검색 결과가 있으면 검색 결과만 표시, 없으면 기존 배우 목록 표시
  const displayActors = debouncedSearchTerm.length >= 2 && searchResults ? searchResults : actors;
  console.log('표시할 배우 데이터:', displayActors);

  return (
    <div className="relative w-full mx-auto px-4">
      <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden px-4">
        <div className="absolute top-10 right-4 flex gap-4 z-10 mr-[120px]">
          {isSearchRendered ? (
            <div 
              ref={searchContainerRef}
              className={`flex items-center bg-gray-6 rounded-full px-4 py-2 shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
                isSearchExpanded ? 'w-[300px]' : 'w-[40px]'
              }`}
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="배우 이름 검색..."
                className={`outline-none bg-transparent text-gray-800 transition-all duration-300 ${
                  isSearchExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className={`text-gray-500 hover:text-gray-700 ml-2 transition-all duration-300 ${
                    isSearchExpanded ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ) : (
            <button 
              onClick={toggleSearch}
              className="p-2 rounded-full bg-gray-7 hover:bg-gray-6"
            >
              <Search className="w-6 h-6" />
            </button>
          )}
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
                    onClick={() => handleSlideClick(index)}
                    style={{ cursor: 'pointer' }}
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