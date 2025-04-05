import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router";
import { ROUTES } from "../../router/routes.ts";
import GenreCarousel from "../../components/genre/GenreCarousel.tsx";
import MovieCard from "../../components/movie/MovieCard";
import { useGenres } from "../../hooks/useGenres";

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

const Detail = () => {
    // URL 파라미터에서 id를 가져옴
    const { id } = useParams<{ id: string }>();
    const genreId = parseInt(id || "0", 10);

    // 장르 데이터 가져오기
    const { data: genres, isLoading, error } = useGenres();
    const [currentGenre, setCurrentGenre] = useState<GenreType | null>(null);

    const [likedMovies, setLikedMovies] = useState<Record<string, boolean>>({});
    const [recommendedMovies, setRecommendedMovies] = useState<MovieProps[]>([]);
    const [allGenreMovies, setAllGenreMovies] = useState<MovieProps[]>([]);

    // 스크롤 제어를 위한 플래그
    const blockAutoScrollRef = useRef<boolean>(false);

    // 캐러셀 관련 상태
    const [emblaApis, setEmblaApis] = useState<Record<string, any>>({});
    const [scrollStates, setScrollStates] = useState<Record<string, {canScrollPrev: boolean, canScrollNext: boolean}>>({});

    // ID에 해당하는 장르 찾기
    useEffect(() => {
        if (genres && genres.length > 0) {
            const foundGenre = genres.find((genre: GenreType) => genre.id === genreId);
            if (foundGenre) {
                setCurrentGenre(foundGenre);
            }
        }
    }, [genres, genreId]);

    // 데이터 로드
    useEffect(() => {
        if (!currentGenre) return;

        // 추천 영화 생성 (10개 - 스크롤 가능하게)
        const recMovies: MovieProps[] = [];
        for (let i = 1; i <= 10; i++) {
            recMovies.push({
                id: i,
                title: `${currentGenre.name} 추천 영화 ${i}`,
                year: '2024',
                month: '5월',
                rating: Number((4 + Math.random()).toFixed(1)),
                image: `https://picsum.photos/seed/rec${currentGenre.name}${i}/300/450`
            });
        }
        setRecommendedMovies(recMovies);

        // 장르 전체 영화 생성 (18개 - 6개씩 3행)
        const genreMovies: MovieProps[] = [];
        for (let i = 1; i <= 18; i++) {
            genreMovies.push({
                id: i + 100,
                title: `${currentGenre.name} 영화 ${i}`,
                year: '2024',
                month: '5월',
                rating: Number((4 + Math.random()).toFixed(1)),
                image: `https://picsum.photos/seed/genre${currentGenre.name}${i}/300/450`
            });
        }
        setAllGenreMovies(genreMovies);
    }, [currentGenre]);

    // 좋아요 클릭 핸들러
    const handleLike = useCallback((movieId: string) => {
        setLikedMovies(prev => ({
            ...prev,
            [movieId]: !prev[movieId]
        }));
    }, []);

    // 캐러셀 초기화 핸들러
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
    }, []);

    // 캐러셀 스크롤 핸들러
    const handleCarouselScroll = useCallback((genreName: string, direction: 'prev' | 'next') => {
        // 자동 스크롤 차단 설정
        blockAutoScrollRef.current = true;

        // emblaApis 사용
        const emblaApi = emblaApis[genreName];
        if (emblaApi) {
            console.log(`${genreName} 캐러셀 스크롤: ${direction}`);
        }
    }, [emblaApis]);

    // 로딩 상태 표시
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-black text-white">장르 정보를 불러오는 중...</div>;
    }

    // 에러 상태 표시
    if (error) {
        return <div className="flex justify-center items-center h-screen bg-black text-white">장르 정보를 불러오는데 실패했습니다.</div>;
    }

    // 장르를 찾지 못한 경우
    if (!currentGenre) {
        return <div className="flex justify-center items-center h-screen bg-black text-white">해당 장르를 찾을 수 없습니다.</div>;
    }

    // GenreCarousel에 전달할 스크롤 상태를 포함한 장르 객체
    const genreWithScrollState = {
        ...currentGenre,
        scrollState: scrollStates[currentGenre.name] || { canScrollPrev: false, canScrollNext: true }
    };

    return (
        <div className="bg-black text-white min-h-screen pb-16">
            {/* 헤더 */}
            <div className="sticky top-0 bg-black z-10 p-4 border-b border-gray-8 mx-5 z-100">
                <div className="flex items-center mx-4">
                    <Link to={ROUTES.GENRE.ROOT} className="text-white mr-3">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">{currentGenre.name}</h1>
                </div>
            </div>

            {/* 장르 개인 맞춤 추천 섹션 */}
            <div className="px-4 mt-6 mb-8">
                <div className="flex justify-between items-center mb-2 mx-10">
                    <h2 className="text-2xl font-bold">{currentGenre.name} 개인 맞춤 추천</h2>
                    <Link to={`${ROUTES.GENRE.ROOT}/${currentGenre.id}/${ROUTES.GENRE.RECOMMENDATIONS}`} className="text-gray-4 flex items-center">
                        더보기
                        <ChevronRight size={16} className="ml-1" />
                    </Link>
                </div>

                {/* 추천 장르 캐러셀 */}
                <GenreCarousel
                    genre={genreWithScrollState}
                    movies={recommendedMovies}
                    likedMovies={likedMovies}
                    handleLike={handleLike}
                    onCarouselInit={(genreName) => handleCarouselInit(`${genreName}-rec`, emblaApis[`${genreName}-rec`])}
                    onCarouselScroll={(genreName, direction) => handleCarouselScroll(`${genreName}-rec`, direction)}
                />
            </div>

            {/* 장르 전체보기 섹션 */}
            <div className="px-4 mb-8 mt-15">
                <div className="flex justify-between items-center mb-2 mx-10">
                    <h2 className="text-2xl font-bold">{currentGenre.name} 전체보기</h2>
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
                                    rating={Number(movie.rating)}
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