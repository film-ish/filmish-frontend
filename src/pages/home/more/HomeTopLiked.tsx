import { useQuery } from '@tanstack/react-query';
import { getmovie } from '../../../api/home/homeApi';
import MovieCard from '../../../components/movie/MovieCard';
import { useAuthStore } from '../../../store/authStore';

interface Movie {
  id: number;
  title: string;
  pubDate: string | null;
  poster: string | null;
  runningTime: number;
  genres: string[];
  value: number;
}

const HomeTopLiked = () => {
  const { isLoggedIn } = useAuthStore();

  const { data: homeData, isLoading, error } = useQuery({
    queryKey: ['home'],
    queryFn: getmovie,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  console.log('HomeTopLiked 렌더링:', { homeData });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">좋아요 TOP 10</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {homeData?.data?.orderByLikes?.map((movie: Movie) => {
          // API 응답 데이터 구조에 맞게 변환
          const formattedMovie = {
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster || '/no-poster-long.png',
            rating: movie.value || 0,
            likes: 0, // 좋아요 수는 API에서 제공하지 않는 것으로 보임
            genres: movie.genres || [],
            runningTime: movie.runningTime || 0
          };
          
          return (
            <MovieCard
              key={movie.id}
              movie={formattedMovie}
              isLoggedIn={isLoggedIn}
              iconType="heart"
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomeTopLiked; 