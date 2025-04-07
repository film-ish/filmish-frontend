import { useState, useCallback, useEffect } from "react";
import MovieCard from "../../movie/MovieCard";
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaCarouselType } from 'embla-carousel';

interface Movie {
  id: number;
  title: string;
  year: string;
  duration: string;
  rating: number;
  img: string;
  genre: Array<{ id: number; name: string }>;
  runningTime: number;
}

interface PersonalRecommendProps {
  movies: Movie[];
}

const PersonalRecommend = ({ movies }: PersonalRecommendProps) => {
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
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-[0_0_calc((100%-5rem)/6)]">
              <MovieCard
                poster={movie.img || '/public/no-poster.png'}
                title={movie.title}
                rating={movie.rating}
                genres={movie.genre ? [movie.genre.map(g => g.name).join(', ')] : []}
                runningTime={movie.runningTime}
                liked={false}
                onLike={() => {}}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalRecommend;