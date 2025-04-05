import { useState, useRef, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FilmIcon } from 'lucide-react';
import MovieTalkActorCard from "./actor-card/MovieTalkActorCard";

const MovieTalkActorSection = () => {
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
  
  const actors = [
    { id: 1, name: '김싸피', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', rating: 4.5, count: 15, recentWork: '귀울임' },
    { id: 2, name: '이싸피', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', rating: 4.2, count: 12, recentWork: '귀울임' },
    { id: 3, name: '박싸피', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80', rating: 4.7, count: 18, recentWork: '귀울임' },
    { id: 4, name: '최싸피', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', rating: 4.1, count: 10, recentWork: '귀울임' },
    { id: 5, name: '정싸피', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', rating: 4.8, count: 20, recentWork: '귀울임' },
    { id: 6, name: '강싸피', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', rating: 4.3, count: 14 },
    { id: 7, name: '조싸피', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', rating: 4.6, count: 16 },
    { id: 8, name: '윤싸피', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', rating: 4.4, count: 13 },
    { id: 9, name: '장싸피', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', rating: 4.4, count: 13 },
    { id: 10, name: '한싸피', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', rating: 4.4, count: 13 },
  ];

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
              {actors.map((actor, index) => (
                <div 
                  key={actor.id} 
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
                        <span className="text-sm">15 작품</span>
                      </div>
                    </div>
                    <span className="text-2xl font-light text-gray-5">최근 작품: {actor.recentWork}</span>
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