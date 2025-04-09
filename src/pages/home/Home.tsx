import BestReview from '../../components/home/best-review/BestReview';
import PersonalRecommend from '../../components/home/personal-recommendation/PersonalRecommend';
import TopTen from '../../components/home/topten/TopTen';
import { ChevronRight, CircleAlert } from 'lucide-react';
import { getmovie } from '../../api/home/homeApi';
import { getRecommendations } from '../../api/genre/getRecommendations'; // 추가: getRecommendations 함수 import
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

const Home = () => {
  // 로그인 상태 확인
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;
  // 툴팁 표시 상태 관리
  const [showTooltip, setShowTooltip] = useState(false);

  // 기본 홈 데이터 가져오기
  const {
    data: homeData,
    isLoading: isHomeLoading,
    error: homeError,
    isFetching: isHomeFetching,
    refetch: refetchHome,
    isSuccess: isHomeSuccess,
    isError: isHomeError,
  } = useQuery({
    queryKey: ['homeData'],
    queryFn: getmovie,
    staleTime: 1000 * 60 * 60 * 24,
  });

  // 추가: 추천 영화 데이터 가져오기 (로그인 상태일 때만)
  const {
    data: recommendedMovies,
    isLoading: isRecommendationsLoading,
    error: recommendationsError,
    isFetching: isRecommendationsFetching,
  } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations(10), // 12개 추천 영화 요청
    enabled: !!accessToken, // accessToken이 존재하는 경우에만 쿼리 실행
  });

  // 마운트 시 및 데이터 변경 시 상태 로깅
  useEffect(() => {}, [
    isHomeLoading,
    isHomeFetching,
    isHomeSuccess,
    isHomeError,
    homeError,
    homeData,
    isLoggedIn,
    accessToken,
    recommendedMovies,
    isRecommendationsLoading,
    isRecommendationsFetching,
    recommendationsError,
  ]);

  // 로딩 중이면 로딩 표시 (홈 데이터만 체크)
  if (isHomeLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  // 오류 발생 시 오류 표시 (홈 데이터만 체크)
  if (homeError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
        <button
          onClick={() => refetchHome()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20">
      {isLoggedIn ? (
        <>
          {/* --- 로그인 상태일 때 --- */}
          {/* Best Review 섹션 */}
          <section className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
            <BestReview reviews={homeData?.data?.bestReviews || []} movies={homeData?.data?.orderByPubdate || []} />
          </section>

          {/* 개인 맞춤 추천 영화 섹션 */}
          <section className="relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold tracking-tight">개인 맞춤 추천 영화</h2>
                <div className="relative">
                  <button
                    className="text-gray-4 hover:text-white transition-colors"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}>
                    <CircleAlert className="w-5 h-5" />
                  </button>
                  {showTooltip && (
                    <div className="absolute -right-30 bottom-7 bg-gray-9 text-center text-white p-2 w-35 bg-gray-6 rounded-md shadow-lg font-extralight z-50 text-xs">
                      사용자가 좋아요를 누른 <br /> 기준으로 맞춤 추천
                    </div>
                  )}
                </div>
              </div>
              <Link
                to={ROUTES.HOME_MORE.RECOMMENDATIONS}
                className="flex items-center gap-2 text-sm text-gray-4 hover:text-white transition-colors">
                더보기 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative w-[calc(100vw-6.25%)] overflow-hidden">
              {/* 변경: React Query로 가져온 추천 영화 데이터 사용 */}
              {isRecommendationsLoading ? (
                <div className="flex items-center justify-center h-48 bg-gray-800 rounded-lg">
                  <div className="text-white">추천 영화 로딩 중...</div>
                </div>
              ) : recommendationsError ? (
                <div className="flex items-center justify-center h-48 bg-gray-800 rounded-lg">
                  <div className="text-red-500">추천 영화를 불러오는데 실패했습니다.</div>
                </div>
              ) : !recommendedMovies || recommendedMovies.length === 0 ? (
                <div className="flex items-center justify-center h-48 bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <p className="text-white mb-2">추천 영화가 없습니다</p>
                    <p className="text-gray-400 text-sm">
                      좋아요를 누른 영화가 충분하지 않거나 서비스 이용 기록이 부족합니다
                    </p>
                  </div>
                </div>
              ) : (
                <PersonalRecommend movies={recommendedMovies} />
              )}
            </div>
          </section>

          {/* 좋아요 TOP 10 섹션 */}
          <section className="relative">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight">좋아요 TOP 10</h2>
            </div>
            <div className="relative w-[calc(100vw-6.25%)] overflow-hidden">
              <TopTen movies={homeData?.data?.orderByLikes || []} isLoggedIn={isLoggedIn} iconType="heart" />
            </div>
          </section>

          {/* 평점 TOP 10 섹션 */}
          <section className="relative">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight">평점 TOP 10</h2>
            </div>
            <div className="relative w-[calc(100vw-6.25%)] overflow-hidden">
              <TopTen movies={homeData?.data?.orderByAvg || []} isLoggedIn={isLoggedIn} />
            </div>
          </section>
        </>
      ) : (
        <>
          {' '}
          {/* --- 로그아웃 상태일 때 --- */}
          <section className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
            <BestReview reviews={homeData?.data?.bestReviews || []} movies={homeData?.data?.orderByPubdate || []} />
          </section>
          {/* 좋아요 TOP 10 섹션 */}
          <section className="relative">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight">좋아요 TOP 10</h2>
            </div>
            <div className="relative w-[calc(100vw-6.25%)] overflow-hidden">
              <TopTen movies={homeData?.data?.orderByLikes || []} isLoggedIn={isLoggedIn} iconType="heart" />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
