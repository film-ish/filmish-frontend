import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import MovieCard from "../../components/movie/MovieCard";

interface MovieProps {
    id: number;
    title: string;
    year: string;
    month: string;
    rating: number;
    image: string;
}

const Recommendations = () => {
    const { genre } = useParams<{ genre: string }>();
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
    }, [genre]);

    // 좋아요 클릭 핸들러
    const handleLike = (movieId: string) => {
        setLikedMovies(prev => ({
            ...prev,
            [movieId]: !prev[movieId]
        }));
    };

    return (
        <div className="bg-black text-white min-h-screen pb-16">
            {/* 헤더 */}
            <div className="sticky top-0 bg-black z-10 p-4 border-b border-gray-8 mx-5">
                <div className="flex items-center mx-4">
                    <Link to={`/genre/${genre}`} className="text-white mr-3">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">{genre}</h1>
                </div>
            </div>

            {/* 장르 추천 전체보기 섹션 */}
            <div className="px-4 mb-8 mt-6">
                <div className="flex justify-between items-center mb-4 mx-10">
                    <h2 className="text-2xl font-bold">{genre} 개인 맞춤 추천</h2>
                </div>

                {/* 그리드 영화 목록 (6개씩 4행) */}
                <div className="mx-10">
                    <div className="grid grid-cols-6 gap-3">
                        {recommendedMovies.map((movie) => (
                            <div key={movie.id} className="flex-shrink-0">
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

export default Recommendations;