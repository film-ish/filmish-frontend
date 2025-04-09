import { useState, useEffect, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import MovieCard from "../../components/movie/MovieCard";
import { Movie } from "../../components/movie/MovieCard"; // Movie 타입 임포트
import { useRecommendStore } from "../../store/recommendStore";
import Button from "../../components/common/Button.tsx";
import { useNavigate } from "react-router-dom";

interface MovieProps {
    id: number;
    title: string;
    year: string;
    month: string;
    rating: number;
    image: string;
    genreNames?: string;
    runningTime: number;
}

const Recommendations = () => {
    const { genre: genreId } = useParams<{ genre: string }>();
    const parsedGenreId = genreId ? parseInt(genreId, 10) : 0;

    const [likedMovies, setLikedMovies] = useState<Record<string, boolean>>({});
    const [recommendedMovies, setRecommendedMovies] = useState<MovieProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const pageSize = 24; // 한 페이지에 24개 영화 표시 (6x4 그리드)

    // Zustand 스토어에서 필요한 데이터 가져오기
    const {
        genres,
        getMoviesByGenre,
        likedMovies: storeLikedMovies,
        toggleLikeMovie
    } = useRecommendStore();

    // 현재 장르 정보 찾기
    const currentGenre = genres.find(g => g.id === parsedGenreId);
    const genreName = currentGenre?.name || `장르 ${parsedGenreId}`;
    const navigate = useNavigate();

    const handleMovieClick = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    }

    // MovieProps 타입에서 Movie 타입으로 변환하는 함수
    const convertToMovieObject = (movieData: MovieProps): Movie => {
        return {
            id: movieData.id,
            title: movieData.title,
            posterPath: movieData.image,
            rating: Number(movieData.rating || 0),
            likes: 0, // 기본값
            genres: movieData.genreNames || `${movieData.year} • ${movieData.month}`,
            runningTime: movieData.runningTime || 0,
            pubDate: `${movieData.year || ''}-${movieData.month || ''}`
        };
    };

    // 추천 영화 데이터 로드 함수
    const loadRecommendedMovies = useCallback(async () => {
        if (!parsedGenreId) return;

        setIsLoading(true);
        setError(null);

        try {
            // recommendStore에서 해당 장르의 추천 영화 가져오기
            const storeMovies = getMoviesByGenre(parsedGenreId);
            console.log(`스토어에서 장르 ${parsedGenreId} 영화 ${storeMovies.length}개 가져옴`);

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
                    image: movie.img || movie.stillcut || `https://picsum.photos/seed/${movie.id}/200/300`, // 이미지가 없으면 대체 이미지
                    runningTime: movie.runningTime || 0,
                    genreNames: genreNames // 장르 이름들을 문자열로 저장
                };
            });

            if (formattedMovies.length > 0) {
                setRecommendedMovies(formattedMovies);
                setTotalPages(Math.ceil(formattedMovies.length / pageSize));
            } else {
                // 스토어에 영화가 없는 경우 폴백 데이터 생성
                console.log(`스토어에 장르 ${parsedGenreId} 영화가 없어 폴백 데이터 사용`);
                const fallbackMovies: MovieProps[] = [];
                for (let i = 1; i <= 24; i++) {
                    fallbackMovies.push({
                        id: i,
                        title: `${genreName} 추천 영화 ${i}`,
                        year: '2024',
                        month: '5월',
                        rating: Number((4 + Math.random()).toFixed(1)),
                        image: `https://picsum.photos/seed/rec${parsedGenreId}${i}/300/450`,
                        genreNames: genreName,
                        runningTime: 0
                    });
                }
                setRecommendedMovies(fallbackMovies);
                setTotalPages(Math.ceil(fallbackMovies.length / pageSize));
            }
        } catch (err) {
            console.error('추천 영화를 가져오는데 실패했습니다:', err);
            setError(err instanceof Error ? err : new Error('추천 영화를 가져오는데 실패했습니다'));
        } finally {
            setIsLoading(false);
        }
    }, [parsedGenreId, getMoviesByGenre, genreName, pageSize]);

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        loadRecommendedMovies();

        // 스토어의 좋아요 정보로 초기화
        setLikedMovies(storeLikedMovies);
    }, [loadRecommendedMovies, storeLikedMovies]);

    // 페이지 변경 처리 - 스크롤 TOP 추가
    const handlePageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            // 페이지 변경 시 스크롤 최상단으로 이동
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            setCurrentPage(page);
        }
    };

    // 현재 페이지의 영화만 표시
    const currentPageMovies = recommendedMovies.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    // 좋아요 클릭 핸들러
    const handleLike = useCallback((movieId: string) => {
        // 로컬 상태 업데이트
        setLikedMovies(prev => ({
            ...prev,
            [movieId]: !prev[movieId]
        }));

        // 스토어 상태 업데이트
        toggleLikeMovie(movieId);
    }, [toggleLikeMovie]);

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
                            variant={page === currentPage ? 'filled' : 'outlined'} // 'text'에서 'outlined'로 변경
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

    return (
        <div className=" text-white min-h-screen pb-16">
            {/* 헤더 */}
            <div className="sticky top-0  z-10 p-4 border-b border-gray-8 mx-5">
                <div className="flex items-center mx-4">
                    <Link to={`/genre/${parsedGenreId}`} className="text-white mr-3">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">{genreName}</h1>
                </div>
            </div>

            {/* 장르 추천 전체보기 섹션 */}
            <div className="px-4 mb-8 mt-6">
                <div className="flex justify-between items-center mb-4 mx-10">
                    <h2 className="text-2xl font-bold">{genreName} 개인 맞춤 추천</h2>
                </div>

                {/* 로딩 상태 표시 */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64 text-white">
                        추천 영화를 불러오는 중...
                    </div>
                ) : error ? (
                    <div className="flex flex-col justify-center items-center h-64 text-white">
                        <p className="mb-4">추천 영화를 불러오는데 실패했습니다.</p>
                        <Button
                            variant="filled"
                            shape="rounded"
                            size="medium"
                            onClick={() => loadRecommendedMovies()}
                        >
                            다시 시도
                        </Button>
                    </div>
                ) : (
                    /* 그리드 영화 목록 (6개씩 4행) */
                    <div className="mx-10">
                        <div className="grid grid-cols-6 gap-3">
                            {currentPageMovies.map((movieData) => {
                                // MovieData를 MovieCard가 필요로 하는 형식으로 변환
                                const movie = convertToMovieObject(movieData);

                                return (
                                    <div
                                        key={movie.id}
                                        className="flex-shrink-0 cursor-pointer"
                                        onClick={() => handleMovieClick(movie.id)}
                                    >
                                        <MovieCard
                                            width="100%"
                                            movie={movie}
                                            isLoggedIn={false}
                                            iconType="star"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            {!isLoading && !error && renderPagination()}
        </div>
    );
};

export default Recommendations;