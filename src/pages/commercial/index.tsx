import {useState, useEffect} from "react";
import {ChevronRight} from "lucide-react";
import {Link} from "react-router";
import MovieCard from "../../components/movie/MovieCard";

interface MovieProps {
    id: number;
    title: string;
    year: string;
    month: string;
    rating: number;
    image: string;
}

const Main = () => {
    const [likedMovies, setLikedMovies] = useState<Record<string, boolean>>({});
    const [recommendedMovies, setRecommendedMovies] = useState<MovieProps[]>([]);

    // 데이터 로드
    useEffect(() => {
        // 추천 영화 데이터 생성 (24개 - 6개씩 4행)
        const recMovies: MovieProps[] = [];
        for (let i = 1; i <= 24; i++) {
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
    }, []);

    // 좋아요 토글 핸들러
    const toggleLike = (movieId: string) => {
        setLikedMovies(prev => {
            const updatedLikedMovies = {
                ...prev,
                [movieId]: !prev[movieId]
            };

            // 좋아요 개수가 3개를 초과하지 않도록 제한
            const likedCount = Object.values(updatedLikedMovies).filter(Boolean).length;
            if (likedCount > 3) {
                updatedLikedMovies[movieId] = false;
            }

            return updatedLikedMovies;
        });
    };

    // 영화카드 직접 클릭 시에는 MovieCard 내부 함수가 실행되지 않도록
    // div.onclick-capture를 사용하여 캡처 단계에서 이벤트를 가로채는 방식으로 해결
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

        // 그 외의 경우만 토글 좋아요 실행
        toggleLike(movieId);
    };

    return (
        <div className="bg-black text-white min-h-screen pb-16">
            {/* 헤더 */}
            <div className="sticky top-0 bg-black z-10 p-4 border-b border-gray-8 mx-5">
                <div className="flex justify-end items-center mx-4">
                    <h1 className="mr-2">다음</h1>
                    <Link to={`/genre`} className="text-white mr-3">
                        <ChevronRight size={24}/>
                    </Link>
                </div>
            </div>

            {/* 장르 추천 전체보기 섹션 */}
            <div className="px-4 mb-8 mt-6">
                <div className="mb-4 mx-10 flex flex-col items-center text-center mb-15">
                    <h2 className="text-3xl font-bold mb-3">영화 좋아요</h2>
                    <h2 className="text-sm text-gray-4">관심있는 영화 3개를 골라 주세요</h2>
                    <h2 className="text-sm text-gray-4">관심 있는 상업영화를 통해 독립영화를 추천해드려요</h2>
                    <div className="mt-2 text-sm text-gray-4">
                        선택된 영화: {Object.values(likedMovies).filter(Boolean).length}/3
                    </div>
                </div>

                {/* 그리드 영화 목록 (6개씩 4행) */}
                <div className="mx-10">
                    <div className="grid grid-cols-6 gap-3">
                        {recommendedMovies.map((movie) => {
                            const movieId = `rec-${movie.id}`;

                            return (
                                <div
                                    key={movie.id}
                                    className="flex-shrink-0 relative group cursor-pointer rounded-lg overflow-hidden"
                                    onClickCapture={(e) => handleCardWrapperClick(e, movieId)}
                                >
                                    <MovieCard
                                        width="100%"
                                        posterSrc={movie.image}
                                        title={movie.title}
                                        rating={movie.rating}
                                        genre={`${movie.year} • ${movie.month}`}
                                        runningTime={0}
                                        liked={!!likedMovies[movieId]}
                                        onLike={() => toggleLike(movieId)}
                                    />
                                    {/* 마우스 호버 시 오버레이 */}
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                                </div>
                            )})}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;