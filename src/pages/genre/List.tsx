// routes/pages/List/List.tsx
import {useState, useEffect, useRef, useCallback} from "react";
import {ChevronRight, ChevronLeft} from "lucide-react";
import Button from "../../components/common/Button.tsx";
import MovieCard from "../../components/movie/MovieCard.tsx";
import {useScroll} from "../../hooks/useScroll";
import { Link } from "react-router";
import {ROUTES} from "../../router/routes.ts";
import useEmblaCarousel from 'embla-carousel-react';

interface MovieProps {
    id: number;
    title: string;
    year: string;
    month: string;
    rating: number | string;
    image: string;
}

// 모든 장르 목록
const allGenres = [
    "공포", "로맨스", "스포츠", "판타지", "공상", "범죄", "액션", "한국 드라마", "코미디", "스릴러", "애니", "SF", "전쟁"
];

// 각 장르별 영화 데이터 생성 함수
const generateMoviesForGenre = (genre: string): MovieProps[] => {
    const movies: MovieProps[] = [];
    for (let i = 1; i <= 10; i++) {
        movies.push({
            id: i,
            title: `${genre} 영화 ${i}`,
            year: '2024',
            month: '5월',
            rating: Number((4 + Math.random()).toFixed(1)),
            image: `https://picsum.photos/seed/${genre}${i}/200/300`
        });
    }
    return movies;
};

// 각 장르별 영화 데이터 생성
const genreMoviesMap = allGenres.reduce((acc, genre) => {
    acc[genre] = generateMoviesForGenre(genre);
    return acc;
}, {} as Record<string, MovieProps[]>);

const List = () => {
    const [activeGenre, setActiveGenre] = useState<string | null>(null);
    const [likedMovies, setLikedMovies] = useState<Record<string, boolean>>({});
    const headerRef = useRef<HTMLDivElement>(null);

    // 스크롤 제어를 위한 플래그
    const blockAutoScrollRef = useRef<boolean>(false);

    // Embla Carousel 관련 상태
    const [emblaApis, setEmblaApis] = useState<Record<string, any>>({});
    const [scrollStates, setScrollStates] = useState<Record<string, {canScrollPrev: boolean, canScrollNext: boolean}>>({});

    // 스크롤 커스텀 훅 사용
    const {registerSectionRef, scrollToSection} = useScroll(headerRef, {offset: -10});

    // 장르 클릭 핸들러
    const handleGenreClick = useCallback((genre: string) => {
        const wasActiveGenre = activeGenre === genre;
        setActiveGenre(prev => prev === genre ? null : genre);
        if (wasActiveGenre) return;

        // 자동 스크롤 허용 상태로 설정
        blockAutoScrollRef.current = false;

        setTimeout(() => {
            // 스크롤 차단 상태가 아닐 때만 스크롤 실행
            if (!blockAutoScrollRef.current) {
                scrollToSection(genre);
            }
        }, 10);
    }, [activeGenre, scrollToSection]);

    // 좋아요 클릭 핸들러
    const handleLike = useCallback((movieId: string) => {
        setLikedMovies(prev => ({
            ...prev,
            [movieId]: !prev[movieId]
        }));
    }, []);

    // Embla Carousel 초기화
    const initializeCarousel = useCallback((genre: string, emblaApi: any) => {
        if (!emblaApi) return;

        setEmblaApis(prev => ({...prev, [genre]: emblaApi}));

        const updateScrollState = () => {
            setScrollStates(prev => ({
                ...prev,
                [genre]: {
                    canScrollPrev: emblaApi.canScrollPrev(),
                    canScrollNext: emblaApi.canScrollNext()
                }
            }));
        };

        updateScrollState();
        emblaApi.on('select', updateScrollState);
        emblaApi.on('reInit', updateScrollState);

        return () => {
            emblaApi.off('select', updateScrollState);
            emblaApi.off('reInit', updateScrollState);
        };
    }, []);

    // 캐러셀 스크롤 핸들러 - 이벤트 객체 받고 스크롤 차단
    const handleCarouselScroll = useCallback((e: React.MouseEvent, genre: string, direction: 'prev' | 'next') => {
        // 이벤트 전파 중지
        e.preventDefault();
        e.stopPropagation();

        // 자동 스크롤 차단 설정
        blockAutoScrollRef.current = true;

        // 캐러셀 이동
        const emblaApi = emblaApis[genre];
        if (!emblaApi) return;

        if (direction === 'prev') {
            emblaApi.scrollPrev();
        } else {
            emblaApi.scrollNext();
        }
    }, [emblaApis]);

    // 활성화된 장르가 변경되면 해당 섹션으로 스크롤
    useEffect(() => {
        if (activeGenre && !blockAutoScrollRef.current) {
            const timeoutId = setTimeout(() => {
                scrollToSection(activeGenre);
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [activeGenre, scrollToSection]);

    // 장르 순서 정렬
    const sortedGenres = [...allGenres].sort((a, b) => {
        if (a === activeGenre) return -1;
        if (b === activeGenre) return 1;
        return 0;
    });

    // 각 장르별 Embla Carousel 생성
    const createEmblaCarousel = (genre: string) => {
        const [emblaRef, emblaApi] = useEmblaCarousel({
            align: 'start',
            slidesToScroll: 1,
            containScroll: 'trimSnaps',
            loop: false
        });

        // 마운트 시 초기화
        useEffect(() => {
            if (!emblaApi) return;
            return initializeCarousel(genre, emblaApi);
        }, [emblaApi, genre]);

        return emblaRef;
    };

    return (
        <div className="pb-16 bg-black text-white">
            {/* 장르 헤더 섹션 */}
            <div
                ref={headerRef}
                className="sticky top-0 bg-black z-10 p-4 border-b border-gray-8 z-100"
            >
                <h1 className="text-xl font-bold mb-2 mx-10">장르별 추천</h1>
                <div className="flex flex-wrap py-2 mx-10">
                    {allGenres.map((genre) => (
                        <div key={genre} className="mr-1 mb-1">
                            <Button
                                variant="filled"
                                shape="rounded-full"
                                size="small"
                                bgColor={activeGenre === genre ? "black" : "gray-6"}
                                textColor="white"
                                onClick={() => handleGenreClick(genre)}
                                className="px-[10px] h-[26px]"
                            >
                                #{genre}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4">
                {sortedGenres.map(genre => {
                    const emblaRef = createEmblaCarousel(genre);
                    const scrollState = scrollStates[genre] || { canScrollPrev: false, canScrollNext: true };

                    return (
                        <div
                            key={genre}
                            ref={registerSectionRef(genre)}
                            id={`genre-section-${genre}`}
                            data-genre={genre}
                            className="genre-section"
                        >
                            {/* 섹션 내용 */}
                            <section
                                className={`mb-6 ${activeGenre === genre ? 'bg-gray-8 -mx-4 px-4 py-2 rounded-lg' : ''}`}
                            >
                                {/* 섹션 헤더 */}
                                <div className="flex justify-between items-center mb-2 mx-10">
                                    <h2 className="text-lg font-bold">{genre}</h2>
                                    <Link to={`${ROUTES.GENRE.ROOT}/${genre}`} className="text-gray-4 flex items-center">
                                        더보기
                                        <ChevronRight size={16} className="ml-1" />
                                    </Link>
                                </div>

                                {/* 캐러셀 */}
                                <div className="relative">
                                    {/* 왼쪽 화살표 버튼 */}
                                    {scrollState.canScrollPrev && (
                                        <button
                                            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/40 border border-white/30 rounded-full flex items-center justify-center"
                                            onClick={(e) => handleCarouselScroll(e, genre, 'prev')}
                                        >
                                            <ChevronLeft size={20} className="text-white" />
                                        </button>
                                    )}

                                    {/* Embla Carousel */}
                                    <div className="overflow-hidden mx-10" ref={emblaRef}>
                                        <div className="flex">
                                            {genreMoviesMap[genre].map(movie => {
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
                                            className="absolute right-0 top-1/2 transform -translate-y-1/2   z-10 w-10 h-10 bg-black/40 border border-white/30 rounded-full flex items-center justify-center"
                                            onClick={(e) => handleCarouselScroll(e, genre, 'next')}
                                        >
                                            <ChevronRight size={20} className="text-white" />
                                        </button>
                                    )}
                                </div>
                            </section>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default List;