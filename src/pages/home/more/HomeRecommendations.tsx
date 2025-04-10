import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '../../../api/genre/getRecommendations';
import MovieCard from '../../../components/movie/MovieCard';
import { useAuthStore } from '../../../store/authStore';
import { useEffect } from 'react';

interface Movie {
  id: number;
  title: string;
  rates: number;
  img: string;
  genre: Array<{ id: number; name: string }>;
  runningTime: number;
  pubDate: string;
  stillcut: string | null;
}

const HomeRecommendations = () => {
  const { isLoggedIn, accessToken } = useAuthStore();

  const { data: recommendedMovies, isLoading, error, isFetching } = useQuery({
    queryKey: ['recommendations', 20],
    queryFn: () => getRecommendations(20),
    enabled: !!accessToken, // accessToken이 존재하는 경우에만 쿼리 실행
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    console.log('HomeRecommendations 마운트:', { isLoggedIn, accessToken });
  }, [isLoggedIn, accessToken]);

  // 데이터 변경 시 로그
  useEffect(() => {
    console.log('HomeRecommendations 데이터 변경:', { 
      recommendedMovies, 
      isLoading, 
      isFetching,
      error 
    });
  }, [recommendedMovies, isLoading, isFetching, error]);

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

  // 로그인하지 않은 경우 안내 메시지 표시
  if (!accessToken) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">개인 맞춤 추천 영화</h1>
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-xl mb-4">로그인이 필요한 서비스입니다</p>
            <p className="text-gray-400">개인 맞춤 추천을 받으려면 로그인해주세요</p>
          </div>
        </div>
      </div>
    );
  }

  // 추천 영화가 없는 경우 안내 메시지 표시
  if (!recommendedMovies || recommendedMovies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">개인 맞춤 추천 영화</h1>
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-xl mb-4">추천 영화가 없습니다</p>
            <p className="text-gray-400">좋아요를 누른 영화가 충분하지 않거나 서비스 이용 기록이 부족합니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">개인 맞춤 추천 영화</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {recommendedMovies.map((movie: Movie) => {
          // API 응답 데이터 구조에 맞게 변환
          const formattedMovie = {
            id: movie.id,
            title: movie.title,
            posterPath: movie.img || movie.stillcut || '/no-poster-long.png',
            rating: movie.rates || 0,
            likes: 0, // 좋아요 수는 API에서 제공하지 않는 것으로 보임
            genres: movie.genre ? movie.genre.map(g => g.name) : [],
            runningTime: movie.runningTime || 0,
            pubDate: movie.pubDate || ''
          };
          
          return (
            <MovieCard
              key={movie.id}
              movie={formattedMovie}
              isLoggedIn={isLoggedIn}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomeRecommendations; 