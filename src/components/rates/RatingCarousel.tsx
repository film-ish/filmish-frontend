// RatingCarousel.tsx 컴포넌트 - 무한 루프 수정
import React, { useEffect, useCallback, useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import MovieCard from "../movie/MovieCard.tsx";
import { useNavigate } from "react-router-dom";
import { Movie } from "../movie/MovieCard.tsx"; // Movie 타입 임포트

interface MovieProps {
    id: number;
    title: string;
    year: string;
    month: string;
    rating: number | string;
    image: string;
    runningTime?: number;
    genreNames?: string;
}

interface RatingType {
    id: string;
    label: string;
    image?: string;
    scrollState?: {canScrollPrev: boolean, canScrollNext: boolean};
}

interface RatingCarouselProps {
    rating: RatingType;
    movies: MovieProps[];
    likedMovies: Record<string, boolean>;
    handleLike: (movieId: string) => void;
    onCarouselInit?: (ratingId: string, emblaApi: any) => void;
    onCarouselScroll?: (ratingId: string, direction: 'prev' | 'next') => void;
}

const RatingCarousel: React.FC<RatingCarouselProps> = ({
                                                           rating,
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

    const navigate = useNavigate();
    // 이벤트 리스너 등록 상태를 추적하기 위한 ref
    const hasRegisteredListenersRef = useRef(false);

    const handleMovieClick = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    }

    // 캐러셀 초기화 핸들러
    const handleInit = useCallback(() => {
        if (!emblaApi || !onCarouselInit) return;
        onCarouselInit(rating.id, emblaApi);
    }, [emblaApi, rating.id, onCarouselInit]);

    // 스크롤 이벤트 핸들러
    const handleScroll = useCallback((e: React.MouseEvent, direction: 'prev' | 'next') => {
        e.preventDefault();
        e.stopPropagation();

        if (emblaApi) {
            if (direction === 'prev') {
                emblaApi.scrollPrev();
            } else {
                emblaApi.scrollNext();
            }
        }

        if (onCarouselScroll) {
            onCarouselScroll(rating.id, direction);
        }
    }, [emblaApi, rating.id, onCarouselScroll]);

    // 초기화 이펙트 - 무한 루프 방지 로직 추가
    useEffect(() => {
        if (emblaApi && !hasRegisteredListenersRef.current) {
            // 초기화 호출
            handleInit();

            // 이벤트 리스너 등록을 한 번만 수행하기 위한 플래그
            hasRegisteredListenersRef.current = true;

            // 스크롤 상태 업데이트 함수
            const updateScrollState = () => {
                if (onCarouselScroll && emblaApi) {
                    const canScrollPrev = emblaApi.canScrollPrev();
                    const canScrollNext = emblaApi.canScrollNext();

                    // 정말 필요할 때만 상태 업데이트 호출
                    const currentScrollState = rating.scrollState || { canScrollPrev: false, canScrollNext: true };
                    if (currentScrollState.canScrollPrev !== canScrollPrev ||
                        currentScrollState.canScrollNext !== canScrollNext) {
                        // 스크롤 상태가 실제로 변경되었을 때만 이벤트 발생
                        onCarouselScroll(rating.id, canScrollPrev ? 'prev' : 'next');
                    }
                }
            };

            // 이벤트 리스너 등록
            emblaApi.on('select', updateScrollState);
            emblaApi.on('reInit', updateScrollState);

            // 초기 상태 설정을 위한 한 번만 실행
            const timer = setTimeout(updateScrollState, 100);

            return () => {
                clearTimeout(timer);
                if (emblaApi) {
                    emblaApi.off('select', updateScrollState);
                    emblaApi.off('reInit', updateScrollState);
                }
                hasRegisteredListenersRef.current = false;
            };
        }
    }, [emblaApi, handleInit, rating.id, onCarouselScroll, rating.scrollState]);

    // 스크롤 상태 가져오기
    const scrollState = rating.scrollState || { canScrollPrev: false, canScrollNext: true };

    // MovieProps를 Movie 타입으로 변환하는 함수
    const convertToMovieObject = (movieData: MovieProps): Movie => {
        return {
            id: movieData.id,
            title: movieData.title,
            posterPath: movieData.image,
            rating: Number(movieData.rating),
            likes: 0,
            genres: movieData.genreNames || `${movieData.year} • ${movieData.month}`,
            runningTime: movieData.runningTime || 0,
            pubDate: `${movieData.year}-${movieData.month}`
        };
    };

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
                    {movies.map(movieData => {
                        const movieKey = `${movieData.id}-${movieData.title}`;
                        const movie = convertToMovieObject(movieData);

                        return (
                            <div
                                key={movieKey}
                                className="flex-[0_0_16.666%] min-w-0 pl-1 pr-2 cursor-pointer"
                                onClick={() => handleMovieClick(movieData.id)}
                            >
                                <MovieCard
                                    width="100%"
                                    movie={movie}
                                    isLoggedIn={true}
                                    iconType="star"
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

export default RatingCarousel;