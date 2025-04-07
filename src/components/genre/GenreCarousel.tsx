// GenreCarousel.tsx 컴포넌트 수정
import React, { useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import MovieCard from "../movie/MovieCard.tsx";

interface MovieProps {
    id: number;
    title: string;
    year: string;
    month: string;
    rating: number | string;
    image: string;
}

interface GenreType {
    id: number;
    name: string;
    image: string;
    scrollState?: {canScrollPrev: boolean, canScrollNext: boolean};
}

interface GenreCarouselProps {
    genre: GenreType;
    movies: MovieProps[];
    likedMovies: Record<string, boolean>;
    handleLike: (movieId: string) => void;
    onCarouselInit?: (genreName: string, emblaApi: any) => void; // 수정: 콜백 함수 타입 변경
    onCarouselScroll?: (genreName: string, direction: 'prev' | 'next') => void; // 수정: 콜백 함수 타입 변경
}

const GenreCarousel: React.FC<GenreCarouselProps> = ({
                                                         genre,
                                                         movies,
                                                         likedMovies,
                                                         handleLike,
                                                         onCarouselInit,
                                                         onCarouselScroll
                                                     }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
        loop: false
    });

    // 컴포넌트 내부에서 캐러셀 초기화 로직을 처리하도록 변경
    const handleInit = useCallback(() => {
        if (!emblaApi || !onCarouselInit) return;

        // 부모 컴포넌트의 콜백을 호출하되, 여기서 필요한 정보만 전달
        onCarouselInit(genre.name, emblaApi);
    }, [emblaApi, genre.name, onCarouselInit]);

    // 컴포넌트 내부에서 스크롤 핸들링 로직을 처리하도록 변경
    const handleScroll = useCallback((e: React.MouseEvent, direction: 'prev' | 'next') => {
        e.preventDefault();
        e.stopPropagation();

        // 직접 스크롤 동작 처리
        if (emblaApi) {
            if (direction === 'prev') {
                emblaApi.scrollPrev();
            } else {
                emblaApi.scrollNext();
            }
        }

        // 부모에게 스크롤 발생 알림
        if (onCarouselScroll) {
            onCarouselScroll(genre.name, direction);
        }
    }, [emblaApi, genre.name, onCarouselScroll]);

    // 초기화 이펙트 - 의존성 배열 간소화
    useEffect(() => {
        if (emblaApi) {
            handleInit();
        }
    }, [emblaApi, handleInit]);

    // 스크롤 상태 가져오기
    const scrollState = genre.scrollState || { canScrollPrev: false, canScrollNext: true };

    return (
        <div className="relative">
            {/* 왼쪽 화살표 버튼 */}
            {scrollState.canScrollPrev && (
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/40 border border-white/30 rounded-full flex items-center justify-center"
                    onClick={(e) => handleScroll(e, 'prev')}
                >
                    <ChevronLeft size={20} className="text-white" />
                </button>
            )}

            {/* Embla Carousel */}
            <div className="overflow-hidden mx-10" ref={emblaRef}>
                <div className="flex">
                    {movies.map(movie => {
                        const movieKey = `${movie.id}-${movie.title}`;
                        return (
                            <div key={movieKey} className="flex-[0_0_16.666%] min-w-0 pl-1 pr-2">
                                <MovieCard
                                    width="100%"
                                    posterSrc={movie.image}
                                    title={movie.title}
                                    rating={Number(movie.rating)}
                                    genre={`${movie.year} • ${movie.month}`}
                                    runningTime={0}
                                    liked={!!likedMovies[movieKey]}
                                    onLike={() => handleLike(movieKey)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 오른쪽 화살표 버튼 */}
            {scrollState.canScrollNext && (
                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/40 border border-white/30 rounded-full flex items-center justify-center"
                    onClick={(e) => handleScroll(e, 'next')}
                >
                    <ChevronRight size={20} className="text-white" />
                </button>
            )}
        </div>
    );
};

export default GenreCarousel;