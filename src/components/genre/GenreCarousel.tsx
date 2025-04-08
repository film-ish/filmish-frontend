// GenreCarousel.tsx 컴포넌트 수정
import React, { useEffect, useCallback } from "react";
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

interface GenreType {
    id: number;
    name: string;
    image?: string;
    scrollState?: {canScrollPrev: boolean, canScrollNext: boolean};
}

interface GenreCarouselProps {
    genre: GenreType;
    movies: MovieProps[];
    likedMovies: Record<string, boolean>;
    handleLike: (movieId: string) => void;
    onCarouselInit?: (genreName: string, emblaApi: any) => void;
    onCarouselScroll?: (genreName: string, direction: 'prev' | 'next') => void;
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

    const navigate = useNavigate();
    const handleMovieClick = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    }

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

    // MovieProps를 Movie 타입으로 변환하는 함수
    const convertToMovieObject = (movieData: MovieProps): Movie => {
        return {
            id: movieData.id,
            title: movieData.title,
            posterPath: movieData.image, // image를 posterPath로 매핑
            rating: Number(movieData.rating),
            likes: 0, // 기본값 설정
            genres: movieData.genreNames || `${movieData.year} • ${movieData.month}`,
            runningTime: movieData.runningTime || 0,
            pubDate: `${movieData.year}-${movieData.month}` // 년도와 월을 조합하여 pubDate 생성
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
                        // 새로운 Movie 객체 생성
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

export default GenreCarousel;