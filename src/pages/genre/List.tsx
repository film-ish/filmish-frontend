import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import Button from "../../components/common/Button.tsx";
import { useScroll } from "../../hooks/useScroll";
import { Link } from "react-router";
import { ROUTES } from "../../router/routes.ts";
import { useGenres } from "../../hooks/useGenres";
import GenreCarousel from "../../components/genre/GenreCarousel.tsx";

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
}

// 각 장르별 영화 데이터 생성 함수
const generateMoviesForGenre = (genreName: string): MovieProps[] => {
    const movies: MovieProps[] = [];
    for (let i = 1; i <= 10; i++) {
        movies.push({
            id: i,
            title: `${genreName} 영화 ${i}`,
            year: '2024',
            month: '5월',
            rating: Number((4 + Math.random()).toFixed(1)),
            image: `https://picsum.photos/seed/${genreName}${i}/200/300`
        });
    }
    return movies;
};

const List = () => {
    // React Query를 사용하여 장르 목록 가져오기
    const { data: genres, isLoading, error } = useGenres();

    const [activeGenre, setActiveGenre] = useState<string | null>(null);
    const [likedMovies, setLikedMovies] = useState<Record<string, boolean>>({});
    const headerRef = useRef<HTMLDivElement>(null);
    const [genreMoviesMap, setGenreMoviesMap] = useState<Record<string, MovieProps[]>>({});

    // 스크롤 제어를 위한 플래그
    const blockAutoScrollRef = useRef<boolean>(false);

    // Embla Carousel 관련 상태 - emblaApis 유지
    const [emblaApis, setEmblaApis] = useState<Record<string, any>>({});
    const [scrollStates, setScrollStates] = useState<Record<string, {canScrollPrev: boolean, canScrollNext: boolean}>>({});

    // 스크롤 커스텀 훅 사용
    const {registerSectionRef, scrollToSection} = useScroll(headerRef, {offset: -10});

    // 장르 데이터가 로드되면 영화 데이터 생성
    useEffect(() => {
        if (genres && genres.length > 0) {
            const moviesMap = genres.reduce((acc: Record<string, MovieProps[]>, genre: GenreType) => {
                acc[genre.name] = generateMoviesForGenre(genre.name);
                return acc;
            }, {});

            setGenreMoviesMap(moviesMap);
        }
    }, [genres]);

    // 장르 클릭 핸들러
    const handleGenreClick = useCallback((genreName: string) => {
        const wasActiveGenre = activeGenre === genreName;
        setActiveGenre(prev => prev === genreName ? null : genreName);
        if (wasActiveGenre) return;

        // 자동 스크롤 허용 상태로 설정
        blockAutoScrollRef.current = false;

        setTimeout(() => {
            // 스크롤 차단 상태가 아닐 때만 스크롤 실행
            if (!blockAutoScrollRef.current) {
                scrollToSection(genreName);
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

    // 캐러셀 초기화 핸들러 - 리팩토링
    const handleCarouselInit = useCallback((genreName: string, emblaApi: any) => {
        if (!emblaApi) return;

        // emblaApi 저장
        setEmblaApis(prev => ({...prev, [genreName]: emblaApi}));

        // 스크롤 상태 업데이트 함수
        const updateScrollState = () => {
            setScrollStates(prev => ({
                ...prev,
                [genreName]: {
                    canScrollPrev: emblaApi.canScrollPrev(),
                    canScrollNext: emblaApi.canScrollNext()
                }
            }));
        };

        // 초기 스크롤 상태 업데이트
        updateScrollState();

        // 이벤트 리스너 등록
        emblaApi.on('select', updateScrollState);
        emblaApi.on('reInit', updateScrollState);

        // 클린업 함수
        return () => {
            emblaApi.off('select', updateScrollState);
            emblaApi.off('reInit', updateScrollState);
        };
    }, []); // 빈 의존성 배열 유지

    // 캐러셀 스크롤 핸들러 - emblaApis 사용하도록 수정
    const handleCarouselScroll = useCallback((genreName: string, direction: 'prev' | 'next') => {
        // 자동 스크롤 차단 설정
        blockAutoScrollRef.current = true;

        // emblaApis 사용 (경고 제거를 위해)
        const emblaApi = emblaApis[genreName];
        if (emblaApi) {
            // emblaApi에 대한 참조만 확인 (실제 스크롤은 컴포넌트 내에서 처리)
            console.log(`${genreName} 캐러셀 스크롤: ${direction} (API 존재: ${!!emblaApi})`);
        }
    }, [emblaApis]); // emblaApis 의존성 추가

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
    const sortedGenres = genres ? [...genres].sort((a, b) => {
        if (a.name === activeGenre) return -1;
        if (b.name === activeGenre) return 1;
        return 0;
    }) : [];

    // 로딩 상태 표시
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-black text-white">장르 목록을 불러오는 중...</div>;
    }

    // 에러 상태 표시
    if (error) {
        return <div className="flex justify-center items-center h-screen bg-black text-white">장르 목록을 불러오는데 실패했습니다.</div>;
    }

    // 캐러셀에서 더 쉽게 접근할 수 있도록 각 장르에 스크롤 상태 추가
    const genresWithScrollState = sortedGenres.map((genre: GenreType) => ({
        ...genre,
        scrollState: scrollStates[genre.name] || { canScrollPrev: false, canScrollNext: true }
    }));

    return (
        <div className="pb-16 bg-black text-white">
            {/* 장르 헤더 섹션 */}
            <div
                ref={headerRef}
                className="sticky top-0 bg-black z-10 p-4 border-b border-gray-8 z-100"
            >
                <h1 className="text-xl font-bold mb-2 mx-10">장르별 추천</h1>
                <div className="flex flex-wrap py-2 mx-10">
                    {genres && genres.map((genre: GenreType) => (
                        <div key={genre.id} className="mr-1 mb-1">
                            <Button
                                variant="filled"
                                shape="rounded-full"
                                size="small"
                                bgColor={activeGenre === genre.name ? "black" : "gray-6"}
                                textColor="white"
                                onClick={() => handleGenreClick(genre.name)}
                                className="px-[10px] h-[26px]"
                            >
                                #{genre.name}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4">
                {genresWithScrollState.map((genre) => {
                    const movies = genreMoviesMap[genre.name] || [];

                    return (
                        <div
                            key={genre.id}
                            ref={registerSectionRef(genre.name)}
                            id={`genre-section-${genre.name}`}
                            data-genre={genre.name}
                            className="genre-section"
                        >
                            {/* 섹션 내용 */}
                            <section
                                className={`mb-6 ${activeGenre === genre.name ? 'bg-gray-8 -mx-4 px-4 py-2 rounded-lg' : ''}`}
                            >
                                {/* 섹션 헤더 */}
                                <div className="flex justify-between items-center mb-2 mx-10">
                                    <h2 className="text-lg font-bold">{genre.name}</h2>
                                    <Link to={`${ROUTES.GENRE.ROOT}/${genre.id}`} className="text-gray-4 flex items-center">
                                        더보기
                                        <ChevronRight size={16} className="ml-1" />
                                    </Link>
                                </div>

                                {/* 수정된 GenreCarousel 컴포넌트 사용 */}
                                <GenreCarousel
                                    genre={genre}
                                    movies={movies}
                                    likedMovies={likedMovies}
                                    handleLike={handleLike}
                                    onCarouselInit={handleCarouselInit}
                                    onCarouselScroll={handleCarouselScroll}
                                />
                            </section>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default List;