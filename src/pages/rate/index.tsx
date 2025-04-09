import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '../../router/routes.ts';
import Button from '../../components/common/Button.tsx';
import { useScroll } from '../../hooks/useScroll.ts';
import GenreCarousel from '../../components/genre/GenreCarousel.tsx';
import { useMovieByRatingsQuery } from '../../hooks/useMovieByRating.ts';

interface MovieProps {
  id: string;
  title: string;
  year: string;
  month: string;
  rating: number | string;
  image: string;
  runningTime?: number;
  genreNames?: string;
}

const Main = () => {
  // React Query를 사용한 커스텀 훅으로 평점별 영화 관련 기능 사용
  const {
    moviesByRating,
    ratingRanges,
    likedMovies,
    isLoading,
    error,
    activeRatingRange,
    setRatingRangeById,
    toggleLikeMovie,
    fetchMoviesByRating,
  } = useMovieByRatingsQuery({
    numRecommendations: 10,
    pageSize: 10,
    enabled: true,
  });

  const headerRef = useRef<HTMLDivElement>(null);

  // 스크롤 제어를 위한 플래그
  const blockAutoScrollRef = useRef<boolean>(false);

  // Embla Carousel 관련 상태
  const [emblaApis, setEmblaApis] = useState<Record<string, any>>({});
  const [scrollStates, setScrollStates] = useState<
    Record<
      string,
      {
        canScrollPrev: boolean;
        canScrollNext: boolean;
      }
    >
  >({});

  // 스크롤 커스텀 훅 사용
  const { registerSectionRef, scrollToSection } = useScroll(headerRef, { offset: -10 });

  // 추천 데이터 새로고침
  const handleRefresh = useCallback(() => {
    fetchMoviesByRating(true); // force=true로 설정하여 캐시 무시하고 새로고침
  }, [fetchMoviesByRating]);

  // 평점 클릭 핸들러
  const handleRatingClick = useCallback(
    (ratingId: string) => {
      const wasActiveRating = activeRatingRange?.id === ratingId;
      setRatingRangeById(wasActiveRating ? null : ratingId);

      if (wasActiveRating) return;

      // 자동 스크롤 허용 상태로 설정
      blockAutoScrollRef.current = false;

      setTimeout(() => {
        // 스크롤 차단 상태가 아닐 때만 스크롤 실행
        if (!blockAutoScrollRef.current) {
          scrollToSection(ratingId);
        }
      }, 10);
    },
    [activeRatingRange, setRatingRangeById, scrollToSection],
  );

  // 좋아요 클릭 핸들러
  const handleLike = useCallback(
    (movieId: string) => {
      toggleLikeMovie(movieId);
    },
    [toggleLikeMovie],
  );

  // 캐러셀 초기화 핸들러
  const handleCarouselInit = useCallback((ratingId: string, emblaApi: any) => {
    if (!emblaApi) return;

    // emblaApi 저장
    setEmblaApis((prev) => ({ ...prev, [ratingId]: emblaApi }));

    // 스크롤 상태 업데이트 함수
    const updateScrollState = () => {
      setScrollStates((prev) => ({
        ...prev,
        [ratingId]: {
          canScrollPrev: emblaApi.canScrollPrev(),
          canScrollNext: emblaApi.canScrollNext(),
        },
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
  const handleCarouselScroll = useCallback(
    (ratingId: string, direction: 'prev' | 'next') => {
      // 자동 스크롤 차단 설정
      blockAutoScrollRef.current = true;

      // emblaApis 사용
      const emblaApi = emblaApis[ratingId];
      if (emblaApi) {
        if (direction === 'prev') {
          emblaApi.scrollPrev();
        } else {
          emblaApi.scrollNext();
        }
      }
    },
    [emblaApis],
  );

  // 활성화된 평점 범위가 변경되면 해당 섹션으로 스크롤
  useEffect(() => {
    if (activeRatingRange && !blockAutoScrollRef.current) {
      const timeoutId = setTimeout(() => {
        scrollToSection(activeRatingRange.id);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [activeRatingRange, scrollToSection]);

  // 평점 순서 정렬 - 이 부분을 제거하거나 수정
  // const sortedRatingRanges = ratingRanges ? [...ratingRanges].sort((a, b) => {
  //     if (a.id === activeRatingRange?.id) return -1;
  //     if (b.id === activeRatingRange?.id) return 1;
  //     return 0;
  // }) : [];

  // 대신 정렬 없이 그대로 사용
  // 영화가 있는 평점 범위만 필터링
  const ratingRangesWithMovies = moviesByRating
    .filter((ratingData) => ratingData.movies.length > 0)
    .map((ratingData) => ratingData.ratingRange);

  // 필터링된 평점 범위만 표시
  const sortedRatingRanges = ratingRangesWithMovies || [];

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">평점별 영화 목록을 불러오는 중...</div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white">
        <p className="mb-4">평점별 영화 목록을 불러오는데 실패했습니다.</p>
        <Button variant="filled" shape="rounded" size="medium" onClick={handleRefresh}>
          다시 시도
        </Button>
      </div>
    );
  }

  // 캐러셀에서 더 쉽게 접근할 수 있도록 각 평점에 스크롤 상태 추가
  const ratingsWithScrollState = sortedRatingRanges.map((rating) => ({
    ...rating,
    scrollState: scrollStates[rating.id] || { canScrollPrev: false, canScrollNext: true },
  }));

  return (
    <div className="pb-16 text-white">
      {/* 평점 헤더 섹션 */}
      <div ref={headerRef} className="sticky top-0 z-10 p-4 border-b border-gray-8">
        <h1 className="text-xl font-bold mb-2 mx-10">평점별 영화</h1>
        <div className="flex flex-wrap py-2 mx-10">
          {sortedRatingRanges.map((rating) => (
            <div key={rating.id} className="mr-1 mb-1">
              <Button
                variant="filled"
                shape="rounded-full"
                size="small"
                bgColor={activeRatingRange?.id === rating.id ? 'cherry-blush' : 'gray-6'}
                textColor="white"
                onClick={() => handleRatingClick(rating.id)}
                className="px-[10px] h-[26px]">
                {rating.label}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4">
        {/* 평점별로 영화 목록 표시 */}
        {moviesByRating.map((ratingData) => {
          // 맵핑된 평점 정보 찾기
          const rating = ratingsWithScrollState.find((r) => r.id === ratingData.ratingRange.id);

          if (!rating) return null;

          // API 응답에 맞게 영화 데이터 가공
          const movies = ratingData.movies.map((movie) => {
            // 영화 개봉일 또는 현재 날짜 가져오기 (pubDate 가 없기 때문에 현재 날짜 사용)
            const currentDate = new Date();
            const year = currentDate.getFullYear().toString();
            const month = currentDate.toLocaleString('ko-KR', { month: 'long' });

            return {
              id: movie.movieId.toString(),
              title: movie.title,
              year: year,
              month: month,
              rating: movie.averageRating,
              image:
                movie.posterUrl !== 'default_poster.jpg'
                  ? movie.posterUrl
                  : `https://picsum.photos/seed/${movie.movieId}/200/300`, // 기본 이미지면 대체 이미지
              genreNames: '', // API 응답에 장르 정보가 없음
            };
          });

          const genre = {
            id: rating.id,
            name: rating.label,
            // 평점 범위를 위한 추가 속성
            ...rating,
          };

          return (
            <div
              key={rating.id}
              ref={registerSectionRef(rating.id)}
              id={`rating-section-${rating.id}`}
              data-rating={rating.label}
              className="rating-section">
              {/* 섹션 내용 */}
              <section
                className={`mb-6 ${activeRatingRange?.id === rating.id ? 'bg-gray-8 -mx-4 px-4 py-2 rounded-lg' : ''}`}>
                {/* 섹션 헤더 */}
                <div className="flex justify-between items-center mb-2 mx-10">
                  <h2 className="text-lg font-bold">{rating.label}</h2>
                </div>

                {/* GenreCarousel 컴포넌트 사용 (평점에 맞게 사용) */}
                <GenreCarousel
                  genre={genre}
                  movies={movies.slice(0, 10)}
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

export default Main;
