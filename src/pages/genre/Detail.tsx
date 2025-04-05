// routes/pages/Detail/Detail.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router";
import useEmblaCarousel from 'embla-carousel-react';
import MovieCard from "../../components/movie/MovieCard";
import {ROUTES} from "../../router/routes.ts";

interface MovieProps {
    id: number;
    title: string;
    year: string;
    month: string;
    rating: number;
    image: string;
}

const Detail = () => {
    const { genre } = useParams<{ genre: string }>();
    console.log(genre)
    const [likedMovies, setLikedMovies] = useState<Record<string, boolean>>({});
    const [recommendedMovies, setRecommendedMovies] = useState<MovieProps[]>([]);
    const [allGenreMovies, setAllGenreMovies] = useState<MovieProps[]>([]);

    // 캐러셀 관련 상태
    const [scrollState, setScrollState] = useState({ canScrollPrev: false, canScrollNext: true });
    const blockAutoScrollRef = useRef<boolean>(false);

    // 데이터 로드
    useEffect(() => {
        // 추천 영화 생성 (10개 - 스크롤 가능하게)
        const recMovies: MovieProps[] = [];
        for (let i = 1; i <= 10; i++) {
            recMovies.push({
                id: i,
                title: `추천 영화 ${i}`,
                year: '2024',
                month: '5월',
                rating: Number((4 + Math.random()).toFixed(1)),
                image: `https://picsum.photos/seed/rec${i}/300/450`
            });
        }
        setRecommendedMovies(recMovies);

        // 장르 전체 영화 생성 (18개 - 6개씩 3행)
        const genreMovies: MovieProps[] = [];
        for (let i = 1; i <= 18; i++) {
            genreMovies.push({
                id: i + 100,
                title: `장르 영화 ${i}`,
                year: '2024',
                month: '5월',
                rating: Number((4 + Math.random()).toFixed(1)),
                image: `https://picsum.photos/seed/genre${i}/300/450`
            });
        }
        setAllGenreMovies(genreMovies);
    }, [genre]);

    // 좋아요 클릭 핸들러
    const handleLike = (movieId: string) => {
        setLikedMovies(prev => ({
            ...prev,
            [movieId]: !prev[movieId]
        }));
    };

    // Embla Carousel 설정
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
        loop: false
    });

    // 스크롤 상태 업데이트
    const updateScrollState = useCallback(() => {
        if (!emblaApi) return;
        setScrollState({
            canScrollPrev: emblaApi.canScrollPrev(),
            canScrollNext: emblaApi.canScrollNext()
        });
    }, [emblaApi]);

    // 캐러셀 초기화
    useEffect(() => {
        if (!emblaApi) return;

        updateScrollState();
        emblaApi.on('select', updateScrollState);
        emblaApi.on('reInit', updateScrollState);

        return () => {
            emblaApi.off('select', updateScrollState);
            emblaApi.off('reInit', updateScrollState);
        };
    }, [emblaApi, updateScrollState]);

    // 캐러셀 스크롤 핸들러
    const handleCarouselScroll = useCallback((e: React.MouseEvent, direction: 'prev' | 'next') => {
        // 이벤트 전파 중지
        e.preventDefault();
        e.stopPropagation();

        // 스크롤 차단 설정
        blockAutoScrollRef.current = true;

        if (!emblaApi) return;

        if (direction === 'prev') {
            emblaApi.scrollPrev();
        } else {
            emblaApi.scrollNext();
        }
    }, [emblaApi]);

    return (
        <div className="bg-black text-white min-h-screen pb-16">
            {/* 헤더 */}
            <div className="sticky top-0 bg-black z-10 p-4 border-b border-gray-8 mx-5 z-100">
                <div className="flex items-center mx-4">
                    <Link to="/genre" className="text-white mr-3">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">{genre}</h1>
                </div>
            </div>

            {/* 장르 개인 맞춤 추천 섹션 */}
            <div className="px-4 mt-6 mb-8">
                <div className="flex justify-between items-center mb-2 mx-10">
                    <h2 className="text-2xl font-bold">{genre} 개인 맞춤 추천</h2>
                    <Link to={`${ROUTES.GENRE.ROOT}/${genre}/${ROUTES.GENRE.RECOMMENDATIONS}`} className="text-gray-4 flex items-center">
                        더보기
                        <ChevronRight size={16} className="ml-1" />
                    </Link>
                </div>

                {/* Embla Carousel */}
                <div className="relative">
                    {/* 왼쪽 화살표 버튼 */}
                    {scrollState.canScrollPrev && (
                        <button
                            className="absolute left-0 top-[30%] z-10 w-10 h-10 bg-black/40 border border-white/30 rounded-full flex items-center justify-center"
                            onClick={(e) => handleCarouselScroll(e, 'prev')}
                        >
                            <ChevronLeft size={20} className="text-white" />
                        </button>
                    )}

                    {/* Embla Carousel 컨테이너 */}
                    <div className="overflow-hidden mx-10" ref={emblaRef}>
                        <div className="flex">
                            {recommendedMovies.map((movie) => (
                                <div key={movie.id} className="flex-[0_0_16.666%] min-w-0 pl-1 pr-2">
                                    <MovieCard
                                        width="100%"
                                        posterSrc={movie.image}
                                        title={movie.title}
                                        rating={movie.rating}
                                        genre={`${movie.year} • ${movie.month}`}
                                        runningTime={0}
                                        liked={!!likedMovies[`rec-${movie.id}`]}
                                        onLike={() => handleLike(`rec-${movie.id}`)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 오른쪽 화살표 버튼 */}
                    {scrollState.canScrollNext && (
                        <button
                            className="absolute right-0 top-[30%] z-10 w-10 h-10 bg-black/40 border border-white/30 rounded-full flex items-center justify-center"
                            onClick={(e) => handleCarouselScroll(e, 'next')}
                        >
                            <ChevronRight size={20} className="text-white" />
                        </button>
                    )}
                </div>
            </div>
            {/* 장르 전체보기 섹션 */}
            <div className="px-4 mb-8 mt-15">
                <div className="flex justify-between items-center mb-2 mx-10">
                    <h2 className="text-2xl font-bold">{genre} 전체보기</h2>

                </div>

                {/* 그리드 영화 목록 (6개씩 3행) */}
                <div className="mx-10">
                    <div className="grid grid-cols-6 gap-3">
                        {allGenreMovies.map((movie) => (
                            <div key={movie.id} className="flex-shrink-0">
                                <MovieCard
                                    width="100%"
                                    posterSrc={movie.image}
                                    title={movie.title}
                                    rating={movie.rating}
                                    genre={`${movie.year} • ${movie.month}`}
                                    runningTime={0}
                                    liked={!!likedMovies[`genre-${movie.id}`]}
                                    onLike={() => handleLike(`genre-${movie.id}`)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center items-center py-6 gap-2">
                {[1, 2, 3, 4, 5].map(page => (
                    <span key={page} className={`text-sm mx-1 ${page === 1 ? 'text-white' : 'text-gray-400'}`}>
                        {page}
                    </span>
                ))}
                <span className="text-sm text-gray-400">...</span>
            </div>
        </div>
    );
};

export default Detail;