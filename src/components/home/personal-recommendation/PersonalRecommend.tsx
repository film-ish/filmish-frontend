import { useState, useCallback, useEffect } from "react";
import MovieCard from "../../movie/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaCarouselType } from 'embla-carousel';

interface MovieData {
  id: number;
  title: string;
  year: string;
  duration: string;
  rating: number;
  imageUrl: string;
  genre: string;
  runningTime: number;
}

const PersonalRecommend = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  
  const movies: MovieData[] = [
    {
      id: 1,
      title: "정적",
      year: "2024",
      duration: "106분",
      rating: 4.8,
      imageUrl: "/images/movie1.jpg",
      genre: "액션",
      runningTime: 106
    },
    {
      id: 2,
      title: "수능을 치다면",
      year: "2023",
      duration: "108분",
      rating: 4.8,
      imageUrl: "/images/movie2.jpg",
      genre: "액션",
      runningTime: 108
    },
    {
      id: 3,
      title: "스틸워터 밸리 번지",
      year: "2024",
      duration: "105분",
      rating: 4.8,
      imageUrl: "/images/movie3.jpg",
      genre: "액션",
      runningTime: 105
    },
    {
      id: 4,
      title: "메다!",
      year: "2024",
      duration: "105분",
      rating: 4.8,
      imageUrl: "/images/movie4.jpg",
      genre: "액션",
      runningTime: 105
    },
    {
      id: 5,
      title: "해야 할 일",
      year: "2024",
      duration: "102분",
      rating: 4.8,
      imageUrl: "/images/movie5.jpg",
      genre: "액션",
      runningTime: 102
    },
    {
      id: 6,
      title: "마블 시티",
      year: "2024",
      duration: "115분",
      rating: 4.7,
      imageUrl: "/images/movie6.jpg",
      genre: "액션",
      runningTime: 115
    },
    {
      id: 7,
      title: "블루 아일랜드",
      year: "2024",
      duration: "98분",
      rating: 4.9,
      imageUrl: "/images/movie7.jpg",
      genre: "드라마",
      runningTime: 98
    },
    {
      id: 8,
      title: "레드 선셋",
      year: "2024",
      duration: "112분",
      rating: 4.6,
      imageUrl: "/images/movie8.jpg",
      genre: "스릴러",
      runningTime: 112
    },
    {
      id: 9,
      title: "퍼플 나이트",
      year: "2024",
      duration: "103분",
      rating: 4.8,
      imageUrl: "/images/movie9.jpg",
      genre: "미스터리",
      runningTime: 103
    },
    {
      id: 10,
      title: "그린 포레스트",
      year: "2024",
      duration: "107분",
      rating: 4.7,
      imageUrl: "/images/movie10.jpg",
      genre: "어드벤처",
      runningTime: 107
    }
  ];

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
                posterSrc={movie.imageUrl}
                title={movie.title}
                rating={movie.rating}
                genre={movie.genre}
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