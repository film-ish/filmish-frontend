import { useState, useCallback, useEffect } from 'react';
import MovieCard from '../../movie/MovieCard';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaCarouselType } from 'embla-carousel';
import { useAuthStore } from '../../../store/authStore';
import { Link } from 'react-router';

interface Movie {
  id: number;
  title: string;
  rates: number;
  img: string;
  genre: Array<{ id: number; name: string }>;
  runningTime: number;
  pubDate: string;
  stillcut: string | null;
}

interface PersonalRecommendProps {
  movies: Movie[];
}

const PersonalRecommend = ({ movies }: PersonalRecommendProps) => {
  const { isLoggedIn } = useAuthStore();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
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

  useEffect(() => {
    console.log('PersonalRecommend 렌더링:', { movies });
  }, [movies]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {movies.map((movie) => (
            <Link key={movie.id} to={`/movies/${movie.id}`} className="flex-[0_0_calc((100%-5rem)/6)]">
              <MovieCard
                movie={{
                  id: movie.id,
                  title: movie.title,
                  posterPath: movie.img || movie.stillcut || '/no-poster-long.png',
                  rating: movie.rates || 0,
                  likes: 0,
                  genres: movie.genre ? movie.genre.map((g) => g.name) : [],
                  runningTime: movie.runningTime || 0,
                  pubDate: movie.pubDate || '',
                }}
                isLoggedIn={isLoggedIn}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalRecommend;
