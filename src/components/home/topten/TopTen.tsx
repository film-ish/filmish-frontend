import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaCarouselType } from 'embla-carousel';
import MovieCard from "../../movie/MovieCard";

interface Movie {
  id: number;
  title: string;
  pubDate: string | null;
  poster: string | null;
  stillcut: string | null;
  runningTime: number;
  genres: string[];
  value: number;
}

interface TopTenProps {
  movies: Movie[];
  isLoggedIn: boolean;
  iconType?: 'star' | 'heart';
}

const TopTen = ({ movies, isLoggedIn = false, iconType = 'star' }: TopTenProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative mb-10">
      <div className="overflow-hidden relative" ref={emblaRef}>
        <div className="flex gap-6">
          {movies.map((movie) => {
            // API 응답 데이터 구조에 맞게 변환
            const formattedMovie = {
              id: movie.id,
              title: movie.title,
              posterPath: movie.poster || movie.stillcut ||'/no-poster-long.png',
              rating: movie.value || 0,
              likes: 0, // 좋아요 수는 API에서 제공하지 않는 것으로 보임
              genres: movie.genres || [],
              runningTime: movie.runningTime || 0,
              pubDate: movie.pubDate || ''
            };
            
            return (
              <div key={movie.id} className="flex-[0_0_calc((100%-5rem)/6)]">
                <MovieCard
                  movie={formattedMovie}
                  isLoggedIn={isLoggedIn}
                  iconType={iconType}
                />
              </div>
            );
          })}
        </div>
      </div>
      {!isLoggedIn && (
        <>
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80rem',
              background: 'linear-gradient(to top, #1A1A1A, rgba(0,0,0,0))',
              pointerEvents: 'none',
              zIndex: 50
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-90%)',
              zIndex: 100,
              textAlign: 'center'
            }}
          >
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                backgroundColor: '#ff5e5e',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                fontWeight: 'bold',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff7a7a'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff5e5e'}
            >
              로그인하러 가기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopTen; 