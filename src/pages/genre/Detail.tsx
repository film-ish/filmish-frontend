import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router";
import { ROUTES } from "../../router/routes.ts";
import GenreCarousel from "../../components/genre/GenreCarousel.tsx";
import MovieCard from "../../components/movie/MovieCard";
import { useGenres } from "../../hooks/useGenres";
import {Movie, useRecommendStore} from "../../store/recommendStore";
import Button from "../../components/common/Button.tsx";
import {getMoviesByGenre} from "../../api/genre/genreMoviesByGenre.ts";
import {useNavigate} from "react-router-dom";

interface MovieProps {
    id: number;
    title: string;
    poster: string | null;
    pubDate: string | null;
    runningTime: number;
    value: number;
    genres: string[];
}

interface GenreType {
    id: number;
    name: string;
    image?: string; // image를 선택적으로 변경
    scrollState?: {canScrollPrev: boolean, canScrollNext: boolean};
}

// API에서 페이지네이션 응답 타입
interface PaginatedResponse {
    content: Array<{
        id: number;
        title: string;
        genre: Array<{ id: number; name: string }>;
        runningTime: number;
        rates: number;
        img: string | null;
        // 기타 필요한 필드들
    }>;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // 현재 페이지 (0-based)
    numberOfElements: number;
    // 기타 필요한 필드들
}

const Detail = () => {
    // URL 파라미터에서 id를 가져옴
    // const { id } = useParams<{ id: string }>();
    // const genreId = parseInt(id || "0", 10);

    // useParams에서 가져오는 파라미터 이름 수정
    const params = useParams();
    const { genre } = params;
    const genreId = genre ? parseInt(genre, 10) : 0;
    const navigate = useNavigate();
    const handleMovieClick = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    }

    // 장르 데이터 가져오기
    // useGenres 훅에 대한 로그 추가
    const { genres } = useRecommendStore();

    const [currentGenre, setCurrentGenre] = useState<GenreType | null>(null);

    // 추천 영화와 전체 영화 상태
    const [likedMovies, setLikedMovies] = useState<Record<string, boolean>>({});
    const [recommendedMovies, setRecommendedMovies] = useState<MovieProps[]>([]);
    const [allGenreMovies, setAllGenreMovies] = useState<MovieProps[]>([]);

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize] = useState<number>(24);
    const [isMoviesLoading, setIsMoviesLoading] = useState<boolean>(false);
    const [moviesError, setMoviesError] = useState<Error | null>(null);

    // Zustand 스토어에서 추천 영화 데이터 가져오기
    const {
        moviesByGenre,
        getMoviesByGenre: getRecommendedMoviesByGenre
    } = useRecommendStore();

    // 스크롤 제어를 위한 플래그
    const blockAutoScrollRef = useRef<boolean>(false);

    // 캐러셀 관련 상태
    const [emblaApis, setEmblaApis] = useState<Record<string, any>>({});
    const [scrollStates, setScrollStates] = useState<Record<string, {canScrollPrev: boolean, canScrollNext: boolean}>>({});

    // ID에 해당하는 장르 찾기
    useEffect(() => {
        if (genres && genres.length > 0 && genreId) {
            const foundGenre = genres.find((g) => g.id === genreId);
            if (foundGenre) {
                setCurrentGenre({
                    id: foundGenre.id,
                    name: foundGenre.name,
                    image: foundGenre.image
                });
            } else {
                // 장르를 찾지 못했을 때 임시 장르 정보 설정
                setCurrentGenre({
                    id: genreId,
                    name: `장르 ${genreId}`
                });
            }
        }
    }, [genres, genreId]);

    useEffect(() => {
        console.log('Detail 컴포넌트 마운트됨, genreId:', genreId);
    }, []);

    // 장르별 영화 API 호출 함수
    // 장르별 영화 API 호출 함수
    const fetchGenreMovies = useCallback(async (page: number = 0) => {
        console.log(`fetchGenreMovies 실행: genreId=${genreId}, page=${page}`);
        if (!genreId) {
            console.log('genreId가 없어서 API 요청 중단');
            return;
        }

        setIsMoviesLoading(true);
        setMoviesError(null);

        try {
            console.log("장르 영화 API 호출");
            const response = await getMoviesByGenre(genreId, page, pageSize);

            // API 응답 구조에 맞게 처리
            if (response && response.data) {
                // 이미 API 응답 구조에 맞는 형태로 전달되므로 그대로 사용
                setAllGenreMovies(response.data.content);

                // 수정된 부분: data 객체 내에서 페이지네이션 정보 가져오기
                setTotalPages(response.data.totalPages || 1);
                setCurrentPage(response.data.number || 0);
            }
        } catch (error) {
            console.error('장르별 영화 조회 중 오류:', error);
            setMoviesError(error instanceof Error ? error : new Error('장르별 영화 조회 중 오류가 발생했습니다'));
        } finally {
            setIsMoviesLoading(false);
        }
    }, [genreId, pageSize]);

    // 추천 영화 데이터 로드
    const loadRecommendedMovies = useCallback(() => {
        console.log(`loadRecommendedMovies 호출됨 - genreId: ${genreId}`);
        if (!genreId) {
            console.log('genreId가 없어서 추천 영화 로드 중단');
            return;
        }
        // 스토어에서 해당 장르의 추천 영화 가져오기
        const storeMovies = getRecommendedMoviesByGenre(genreId);

        console.log(`스토어에서 가져온 장르 ${genreId}의 추천 영화:`, storeMovies[0]);
        if (!storeMovies || storeMovies.length === 0) {
            console.log(`장르 ${genreId}의 추천 영화가 스토어에 없어 API 요청 시도`);
        }
        // 영화 데이터 변환
        const formattedMovies: MovieProps[] = storeMovies.map(movie => {
            const currentDate = new Date();
            const year = currentDate.getFullYear().toString();
            const month = currentDate.toLocaleString('ko-KR', { month: 'long' });
            const genreNames = movie.genre.map(g => g.name).join(', ');
            return {
                id: movie.id,
                title: movie.title,
                year: year,
                month: month,
                rating: movie.rates || 0,
                image: movie.img || `https://picsum.photos/seed/${movie.id}/200/300`, // 이미지가 없으면 대체 이미지
                runningTime: movie.runningTime || 0,
                genreNames: genreNames // 장르 이름들을 문자열로 저장
            };
        });

        setRecommendedMovies(formattedMovies);

        // 추천 영화가 없는 경우 대체 데이터 사용 (개발용, 실제로는 제거 필요)
        if (formattedMovies.length === 0 && currentGenre) {
            const fallbackMovies: MovieProps[] = [];
            for (let i = 1; i <= 10; i++) {
                fallbackMovies.push({
                    id: i,
                    title: `${currentGenre.name} 추천 영화 ${i}`,
                    year: '2024',
                    month: '5월',
                    rating: Number((4 + Math.random()).toFixed(1)),
                    image: `https://picsum.photos/seed/rec${currentGenre.name}${i}/300/450`
                });
            }
            setRecommendedMovies(fallbackMovies);
        }
    }, [genreId, getRecommendedMoviesByGenre, currentGenre]);

    // 컴포넌트 마운트 시 영화 데이터 로드
    useEffect(() => {
        if (currentGenre) {
            console.log(`currentGenre 설정됨: ${currentGenre.name} (ID: ${currentGenre.id})`);
            loadRecommendedMovies();
            fetchGenreMovies(0);
        }
    }, [currentGenre, loadRecommendedMovies, fetchGenreMovies]);

    // 페이지 변경 핸들러
    const handlePageChange = useCallback((page: number) => {
        fetchGenreMovies(page);
    }, [fetchGenreMovies]);

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

        console.log(`캐러셀 초기화: ${genreName}, emblaApi 존재: ${!!emblaApi}`);

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

        // 이벤트 리스너 등록 (emblaApi.on이 함수인지 확인)
        if (typeof emblaApi.on === 'function') {
            emblaApi.on('select', updateScrollState);
            emblaApi.on('reInit', updateScrollState);
        } else {
            console.warn('emblaApi.on is not a function');
        }

        return () => {
            if (emblaApi && typeof emblaApi.off === 'function') {
                emblaApi.off('select', updateScrollState);
                emblaApi.off('reInit', updateScrollState);
            }
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
    // 페이지네이션 렌더링
    // 페이지네이션 렌더링
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        // 페이지네이션 로직
        const pageNumbers: (number | string)[] = [];

        // 항상 첫 페이지를 표시
        pageNumbers.push(0);

        // 현재 페이지 주변 페이지 추가
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages - 2, currentPage + 1);

        // 첫 페이지와 시작 페이지 사이에 간격이 있으면 '...' 추가
        if (startPage > 1) {
            pageNumbers.push('...');
        }

        // 중간 페이지들 추가
        for (let i = startPage; i <= endPage; i++) {
            if (!pageNumbers.includes(i)) {
                pageNumbers.push(i);
            }
        }

        // 끝 페이지와 마지막 페이지 사이에 간격이 있으면 '...' 추가
        if (endPage < totalPages - 2) {
            pageNumbers.push('...');
        }

        // 항상 마지막 페이지를 표시 (총 페이지가 1페이지 이상인 경우)
        if (totalPages > 1 && !pageNumbers.includes(totalPages - 1)) {
            pageNumbers.push(totalPages - 1);
        }

        return (
            <div className="flex justify-center items-center py-6 gap-2">
                {/* 이전 페이지 버튼 */}
                <Button
                    variant="outlined"
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}
                    bgColor="black"
                    textColor="white"
                    className="mx-1"
                >
                    이전
                </Button>

                {/* 페이지 숫자 */}
                {pageNumbers.map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="text-sm text-gray-400 mx-1">...</span>
                    ) : (
                        <Button
                            key={`page-${page}`}
                            variant={page === currentPage ? 'filled' : 'text'}
                            bgColor={page === currentPage ? 'cherry-blush' : 'black'}
                            textColor="white"
                            className={`text-sm mx-1 ${page === currentPage ? 'font-bold' : ''}`}
                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                        >
                            {(page as number) + 1}
                        </Button>
                    )
                ))}

                {/* 다음 페이지 버튼 */}
                <Button
                    variant="outlined"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                    bgColor="black"
                    textColor="white"
                    className="mx-1"
                >
                    다음
                </Button>
            </div>
        );
    };

    // 로딩 상태 표시
    // if (isGenresLoading) {
    //     return <div className="flex justify-center items-center h-screen bg-black text-white">장르 정보를 불러오는 중...</div>;
    // }
    //
    // // 에러 상태 표시
    // if (genresError) {
    //     return <div className="flex justify-center items-center h-screen bg-black text-white">장르 정보를 불러오는데 실패했습니다.</div>;
    // }

    if (!genres || genres.length === 0) {
        return <div className="flex justify-center items-center h-screen bg-black text-white">장르 정보를 불러오는 중...</div>;
    }

// 장르를 찾지 못한 경우
    if (!currentGenre) {
        return <div className="flex justify-center items-center h-screen bg-black text-white">해당 장르를 찾을 수 없습니다.</div>;
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
                {recommendedMovies.length > 0 ? (
                    <GenreCarousel
                        genre={genreWithScrollState}
                        movies={recommendedMovies.slice(0, 10)}
                        likedMovies={likedMovies}
                        handleLike={handleLike}
                        onCarouselInit={handleCarouselInit} // 그냥 함수 자체를 전달
                        onCarouselScroll={handleCarouselScroll} // 그냥 함수 자체를 전달
                    />
                ) : (
                    <div className="flex justify-center items-center h-40 text-gray-400">
                        추천 영화가 없습니다.
                    </div>
                )}
            </div>

            {/* 장르 전체보기 섹션 */}
            <div className="px-4 mb-8 mt-15">
                <div className="flex justify-between items-center mb-2 mx-10">
                    <h2 className="text-2xl font-bold">{currentGenre.name} 전체보기</h2>
                </div>

                {/* 로딩 및 에러 상태 처리 */}
                {isMoviesLoading ? (
                    <div className="flex justify-center items-center h-64 text-white">
                        영화 목록을 불러오는 중...
                    </div>
                ) : moviesError ? (
                    <div className="flex flex-col justify-center items-center h-64 text-white">
                        <p className="mb-4">영화 목록을 불러오는데 실패했습니다.</p>
                        <Button
                            variant="filled"
                            shape="rounded"
                            size="medium"
                            onClick={() => fetchGenreMovies(currentPage)}
                        >
                            다시 시도
                        </Button>
                    </div>
                ) : (
                    /* 그리드 영화 목록 */
                    <div className="mx-10">
                        <div className="grid grid-cols-6 gap-3">
                            {allGenreMovies.map((movie) => (
                                <div key={movie.id} className="flex-shrink-0 cursor-pointer"
                                     onClick={()=>{handleMovieClick(movie.id)}}>
                                    <MovieCard
                                        width="100%"
                                        poster={movie.poster || `https://picsum.photos/seed/genre${movie.id}/300/450`}
                                        title={movie.title}
                                        rating={Number(movie.value || 0)}
                                        genres={movie.genres ? movie.genres.join(', ') : ''}
                                        runningTime={movie.runningTime || 0}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            {!isMoviesLoading && !moviesError && renderPagination()}
        </div>
    );
};

export default Detail;