import {useState, useEffect} from "react";
import {ChevronRight} from "lucide-react";
import {Link, useNavigate} from "react-router";
import MovieCard from "../../components/movie/MovieCard";
import {getCommercialMovies, submitLikedCommercialMovies} from "../../api/commercial/commercialApi";
import Button from "../../components/common/Button";
import {Movie} from "../../components/movie/MovieCard"; // Movie 타입 임포트

interface MovieProps {
    id: number;
    title: string;
    poster: string;
    pubDate: string | null;
    categories: string[];
    rating?: number;
}

const Main = () => {
    const navigate = useNavigate();
    const [likedMovies, setLikedMovies] = useState<Record<string, boolean>>({});
    const [likedMovieIds, setLikedMovieIds] = useState<number[]>([]);
    const [commercialMovies, setCommercialMovies] = useState<MovieProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

    // 데이터 로드
    useEffect(() => {
        fetchCommercialMovies();
    }, []);

    // 좋아요 상태가 변경될 때마다 likedMovieIds 업데이트
    useEffect(() => {
        const ids = Object.entries(likedMovies)
            .filter(([_, isLiked]) => isLiked)
            .map(([id, _]) => parseInt(id));

        setLikedMovieIds(ids);
    }, [likedMovies]);

    // 상업 영화 목록 가져오기
    const fetchCommercialMovies = async () => {
        try {
            setIsInitialLoading(true);
            setError(null);

            const response = await getCommercialMovies();

            if (response && response.data) {
                // API 응답 데이터를 그대로 사용
                setCommercialMovies(response.data);
            } else {
                // 데이터가 없는 경우 임시 데이터 생성
                createFallbackMovies();
            }
        } catch (error) {
            console.error('상업 영화 목록을 가져오는데 실패했습니다:', error);
            setError(error instanceof Error ? error : new Error('상업 영화 목록을 가져오는데 실패했습니다'));

            // 에러 발생 시 임시 데이터 생성
            createFallbackMovies();
        } finally {
            setIsInitialLoading(false);
        }
    };

    // 임시 영화 데이터 생성 (API 실패 시 폴백)
    const createFallbackMovies = () => {
        const fallbackMovies: MovieProps[] = [];
        for (let i = 1; i <= 24; i++) {
            fallbackMovies.push({
                id: i,
                title: `추천 영화 ${i}`,
                poster: `https://picsum.photos/seed/rec${i}/300/450`,
                pubDate: null,
                categories: ['드라마', '코미디'],
                rating: Number((4 + Math.random()).toFixed(1))
            });
        }
        setCommercialMovies(fallbackMovies);
    };

    // 좋아요 토글 핸들러
    const toggleLike = (movieId: string) => {
        // 영화 ID 추출
        const commercialId = parseInt(movieId);

        // 이미 좋아요한 상태인지 확인
        const isCurrentlyLiked = likedMovies[movieId];

        // 좋아요 개수가 5개를 초과하지 않도록 제한
        const likedCount = Object.values(likedMovies).filter(Boolean).length;
        if (!isCurrentlyLiked && likedCount >= 5) {
            console.log('좋아요는 최대 5개까지만 가능합니다.');
            return;
        }

        // 상태 업데이트 (서버 API 호출은 최종 제출 시에만 수행)
        setLikedMovies(prev => ({
            ...prev,
            [movieId]: !isCurrentlyLiked
        }));
    };

    // 좋아요 목록 제출
    const submitLikedMovies = async () => {
        // 좋아요한 영화가 5개가 아닌 경우 알림
        if (likedMovieIds.length !== 5) {
            alert('좋아요한 영화를 5개 선택해주세요.');
            return;
        }

        setIsSubmitting(true);

        try {
            // 좋아요한 영화 목록 한 번에 서버로 전송
            await submitLikedCommercialMovies(likedMovieIds);

            setSubmitSuccess(true);

            // 성공 시 장르 페이지로 자동 이동 (또는 다른 원하는 페이지)
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error) {
            console.error('좋아요 목록 제출 중 오류가 발생했습니다:', error);
            alert('좋아요 목록 제출에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 영화 카드 클릭 핸들러
    const handleMovieClick = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };

    // 영화카드 직접 클릭 시에는 MovieCard 내부 함수가 실행되지 않도록
    const handleCardWrapperClick = (e: React.MouseEvent, movieId: string) => {
        // Heart 아이콘이나 그 부모 버튼을 클릭한 경우는 처리하지 않음
        if (
            e.target instanceof Element &&
            (e.target.tagName === 'svg' ||
                e.target.tagName === 'path' ||
                e.target.closest('button'))
        ) {
            return;
        }

        // 그 외의 경우 영화 상세 페이지로 이동
        handleMovieClick(parseInt(movieId));
    };

    // 장르 문자열 생성 함수
    const formatGenre = (categories: string[]): string => {
        if (!categories || categories.length === 0) {
            return '장르 정보 없음';
        }
        return categories.join(', ');
    };

    // MovieProps 타입을 Movie 타입으로 변환하는 함수
    const convertToMovieObject = (movieData: MovieProps): Movie => {
        return {
            id: movieData.id,
            title: movieData.title,
            posterPath: movieData.poster,
            rating: movieData.rating || 0,
            likes: 0, // 기본값 설정
            genres: formatGenre(movieData.categories),
            runningTime: 0, // 정보 없음
            pubDate: movieData.pubDate || ''
        };
    };

    // 로딩 중 표시
    if (isInitialLoading) {
        return (
            <div className="bg-black text-white min-h-screen flex justify-center items-center">
                <div className="animate-spin h-10 w-10 border-4 border-white rounded-full border-t-transparent"></div>
            </div>
        );
    }

    // 에러 표시
    if (error) {
        return (
            <div className="bg-black text-white min-h-screen flex flex-col justify-center items-center">
                <p className="text-xl mb-4">영화 목록을 불러오는데 실패했습니다.</p>
                <button
                    className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                    onClick={fetchCommercialMovies}
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="text-white min-h-screen pb-16">
            {/* 영화 좋아요 섹션 */}
            <div className="px-4 mb-8 mt-25">
                <div className="mb-4 mx-10 flex flex-col items-center text-center mb-15">
                    <h2 className="text-3xl font-bold mb-3">영화 좋아요</h2>
                    <h2 className="text-sm text-gray-4">관심있는 영화 5개를 골라 주세요</h2>
                    <h2 className="text-sm text-gray-4">관심 있는 상업영화를 통해 독립영화를 추천해드려요</h2>
                    <div className="mt-2 text-sm text-gray-4 mb-4">
                        선택된 영화: {Object.values(likedMovies).filter(Boolean).length}/5
                    </div>

                    {/* 제출 버튼 */}
                    <Button
                        variant="filled"
                        shape="rounded"
                        size="medium"
                        bgColor={likedMovieIds.length === 5 ? "white" : "gray-6"}
                        textColor={likedMovieIds.length === 5 ? "cherry-blush" : "white"}
                        onClick={submitLikedMovies}
                        disabled={likedMovieIds.length !== 5 || isSubmitting}
                        className="px-8 py-2"
                    >
                        {isSubmitting ? '제출 중...' : '선택 완료'}
                    </Button>

                    {/* 성공 메시지 */}
                    {submitSuccess && (
                        <div className="text-green-500 mt-2">
                            성공적으로 제출되었습니다. 추천 페이지로 이동합니다...
                        </div>
                    )}
                </div>

                {/* 그리드 영화 목록 (6개씩 4행) */}
                <div className="mx-10">
                    <div className="grid grid-cols-6 gap-3">
                        {commercialMovies.map((movieData) => {
                            const movieId = `${movieData.id}`;
                            // MovieData를 MovieCard가 필요로 하는 형식으로 변환
                            const movie = convertToMovieObject(movieData);

                            // 좋아요 상태 확인
                            const isLiked = !!likedMovies[movieId];

                            // 좋아요 토글 핸들러
                            const handleLike = () => {
                                toggleLike(movieId);
                            };

                            return (
                                <div
                                    key={movie.id}
                                    className="flex-shrink-0 relative rounded-lg overflow-hidden"
                                    onClick={(e) => handleCardWrapperClick(e, movieId)}
                                >
                                    <MovieCard
                                        width="100%"
                                        movie={movie}
                                        isLoggedIn={true}
                                        iconType="heart"
                                        isLiked={isLiked}
                                        onLike={handleLike}
                                    />
                                    {/* 마우스 호버 시 오버레이 */}
                                    <div
                                        className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;