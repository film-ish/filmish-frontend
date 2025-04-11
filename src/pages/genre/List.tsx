import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import GenreCarousel from '../../components/genre/GenreCarousel.tsx';
import { ROUTES } from '../../router/routes.ts';
import Button from '../../components/common/Button.tsx';
import { useMovieRecommendations } from '../../hooks/useMovieRecommendations.ts';
import { useScroll } from '../../hooks/useScroll.ts';

interface MovieProps {
  id: number;
  title: string;
  year: string;
  month: string;
  rating: number | string;
  image: string;
}

const List = () => {
  // 커스텀 훅으로 영화 추천 및 장르 관련 기능 사용
  const {
    moviesByGenre,
    genres,
    likedMovies,
    isLoading,
    error,
    activeGenreName,
    setGenreByName,
    toggleLikeMovie,
    fetchRecommendations,
  } = useMovieRecommendations({
    autoFetch: true, // 컴포넌트 마운트 시 자동으로 데이터 가져오기
    numRecommendations: 100, // 30개의 추천 영화 요청
    cacheDuration: 10 * 60 * 60 * 1000, // 10분 캐시 유효 시간
    minGenreCount: 2, // 4개 이상의 영화가 있는 장르만 주요 장르로 표시
  });

  const headerRef = useRef<HTMLDivElement>(null);

  // 스크롤 제어를 위한 플래그
  const blockAutoScrollRef = useRef<boolean>(false);

  // Embla Carousel 관련 상태
  const [emblaApis, setEmblaApis] = useState<Record<string, any>>({});
  const [scrollStates, setScrollStates] = useState<Record<string, { canScrollPrev: boolean; canScrollNext: boolean }>>(
    {},
  );

  // 스크롤 커스텀 훅 사용
  const { registerSectionRef, scrollToSection } = useScroll(headerRef, { offset: -10 });

  // 추천 데이터 새로고침
  const handleRefresh = useCallback(() => {
    fetchRecommendations(true); // force=true로 설정하여 캐시 무시하고 새로고침
  }, [fetchRecommendations]);

  // 장르 클릭 핸들러
  const handleGenreClick = () => {
    navigate(`/genre#${genre.id}`);
  };
  // const handleGenreClick = useCallback(
  //   (genreName: string) => {
  //     const wasActiveGenre = activeGenreName === genreName;
  //     setGenreByName(wasActiveGenre ? null : genreName);

  //     if (wasActiveGenre) return;

  //     // 자동 스크롤 허용 상태로 설정
  //     blockAutoScrollRef.current = false;

  //     setTimeout(() => {
  //       // 스크롤 차단 상태가 아닐 때만 스크롤 실행
  //       if (!blockAutoScrollRef.current) {
  //         scrollToSection(genreName);
  //       }
  //     }, 10);
  //   },
  //   [activeGenreName, setGenreByName, scrollToSection],
  // );

  // 좋아요 클릭 핸들러
  const handleLike = useCallback(
    (movieId: string) => {
      toggleLikeMovie(movieId);
    },
    [toggleLikeMovie],
  );

  // 캐러셀 초기화 핸들러
  const handleCarouselInit = useCallback((genreName: string, emblaApi: any) => {
    if (!emblaApi) return;

    // emblaApi 저장
    setEmblaApis((prev) => ({ ...prev, [genreName]: emblaApi }));

    // 스크롤 상태 업데이트 함수
    const updateScrollState = () => {
      setScrollStates((prev) => ({
        ...prev,
        [genreName]: {
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
    (genreName: string, direction: 'prev' | 'next') => {
      // 자동 스크롤 차단 설정
      blockAutoScrollRef.current = true;

      // emblaApis 사용
      const emblaApi = emblaApis[genreName];
      if (emblaApi) {
        console.log(`${genreName} 캐러셀 스크롤: ${direction} (API 존재: ${!!emblaApi})`);
      }
    },
    [emblaApis],
  );

  // 활성화된 장르가 변경되면 해당 섹션으로 스크롤
  useEffect(() => {
    if (activeGenreName && !blockAutoScrollRef.current) {
      const timeoutId = setTimeout(() => {
        scrollToSection(activeGenreName);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [activeGenreName, scrollToSection]);

  // 장르 순서 정렬
  const sortedGenres = genres
    ? [...genres].sort((a, b) => {
        if (a.name === activeGenreName) return -1;
        if (b.name === activeGenreName) return 1;
        // '그외' 관련 코드 제거
        return 0;
      })
    : [];

  // 로딩 상태 표시
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen  text-white">영화 추천 목록을 불러오는 중...</div>;
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white">
        <p className="mb-4">영화 추천 목록을 불러오는데 실패했습니다.</p>
        <Button variant="filled" shape="rounded" size="medium" onClick={handleRefresh}>
          다시 시도
        </Button>
      </div>
    );
  }

  // 캐러셀에서 더 쉽게 접근할 수 있도록 각 장르에 스크롤 상태 추가
  const genresWithScrollState = sortedGenres.map((genre) => ({
    ...genre,
    scrollState: scrollStates[genre.name] || { canScrollPrev: false, canScrollNext: true },
  }));

  return (
    <div className="min-h-screen pb-16 text-white">
      {/* 장르 헤더 섹션 */}
      <div ref={headerRef} className="sticky top-[3.75rem] bg-gray-8 z-10 p-4 border-b border-gray-8">
        <h1 className="text-xl font-bold mb-2 mx-10">장르별 추천</h1>
        <div className="overflow-x-clip flex py-2 mx-10">
          {genres &&
            genres.map((genre) => (
              <div key={genre.id} className="mr-1 mb-1 whitespace-nowrap">
                <Button
                  variant="filled"
                  shape="rounded-full"
                  size="small"
                  bgColor={activeGenreName === genre.name ? 'cherry-blush' : 'gray-6'}
                  textColor="white"
                  onClick={() => handleGenreClick(genre.name)}
                  className="px-[10px] h-[26px]">
                  #{genre.name}
                </Button>
              </div>
            ))}
        </div>
      </div>

      <div className="px-4">
        {/* 장르별로 영화 목록 표시 */}
        {moviesByGenre.map((genreData) => {
          // 맵핑된 장르 정보 찾기
          const genre = genresWithScrollState.find((g) => g.id === genreData.genreId);

          if (!genre) return null;

          // 영화 데이터 가공하여 MovieCard 컴포넌트에 맞는 형식으로 변환
          const movies = genreData.movies.map((movie) => {
            // 영화 개봉일 또는 현재 날짜 가져오기 (pubDate 가 없기 때문에 현재 날짜 사용)
            const currentDate = new Date();
            const year = currentDate.getFullYear().toString();
            const month = currentDate.toLocaleString('ko-KR', { month: 'long' });

            // 장르 문자열 생성 (장르가 여러 개인 경우 쉼표로 구분)
            const genreNames = movie.genre.map((g) => g.name).join(', ');

            return {
              id: movie.id,
              title: movie.title,
              year: year,
              month: month,
              rating: movie.rates || 0,
              image: movie.img || movie.stillcut || `https://picsum.photos/seed/${movie.id}/200/300`, // 이미지가 없으면 대체 이미지
              runningTime: movie.runningTime || 0,
              genreNames: genreNames, // 장르 이름들을 문자열로 저장
            };
          });

          return (
            <div
              key={genre.id}
              ref={registerSectionRef(genre.name)}
              id={`${genre.name}`}
              data-genre={genre.name}
              className="genre-section">
              {/* 섹션 내용 */}
              <section
                className={`mb-6 ${activeGenreName === genre.name ? 'bg-gray-8 -mx-4 px-4 py-2 rounded-lg' : ''}`}>
                {/* 섹션 헤더 */}
                <div className="flex justify-between items-center mb-2 mx-10">
                  <h2 className="text-lg font-bold">{genre.name}</h2>
                  <Link to={`${ROUTES.GENRE.ROOT}/${genre.id}`} className="text-gray-4 flex items-center">
                    더보기
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>

                {/* GenreCarousel 컴포넌트 사용 */}
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

export default List;
