import {useState, useEffect, useCallback, useRef} from 'react';
import { useRecommendStore, type Movie, type Genre, type MovieByGenre } from '../store/recommendStore';
import {getRecommendations} from "../api/genre/getRecommendations.ts";

// 커스텀 훅 옵션 타입
interface UseMovieRecommendationsProps {
    autoFetch?: boolean;
    numRecommendations?: number;
    cacheDuration?: number; // 캐시 유효 시간(ms)
    minGenreCount?: number; // 메인 장르로 표시할 최소 장르 개수
}

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 기본 5분
const ETC_GENRE_ID = 999999; // '그외' 장르의 ID
const ETC_GENRE_NAME = '그외'; // '그외' 장르의 이름

// 영화 추천 데이터 관리를 위한 커스텀 훅
export const useMovieRecommendations = ({
                                            autoFetch = true,
                                            numRecommendations = 100,
                                            cacheDuration = DEFAULT_CACHE_DURATION,
                                            minGenreCount = 2
                                        }: UseMovieRecommendationsProps = {}) => {
    const {
        recommendations,
        moviesByGenre,
        genres,
        likedMovies,
        isLoading,
        error,
        lastUpdated,
        isHydrated, // 하이드레이션 상태 가져오기
        setRecommendations,
        setLoading,
        setError,
        toggleLikeMovie,
        getMoviesByGenre
    } = useRecommendStore();

    const [activeGenreId, setActiveGenreId] = useState<number | null>(null);
    const [activeGenreName, setActiveGenreName] = useState<string | null>(null);

    // 영화 데이터를 가져오고 장르별로 분류하는 함수
    const fetchAndProcessRecommendations = useCallback(async (force = false) => {
        // 조건 확인 로그
        console.log('=== 추천 데이터 요청 조건 확인 ===');
        console.log('force:', force);
        console.log('recommendations 비어있음:', !recommendations.length);
        console.log('lastUpdated 없음:', !lastUpdated);
        console.log('캐시 만료 여부:', lastUpdated ? (Date.now() - lastUpdated >= cacheDuration) : 'lastUpdated 없음');
        console.log('현재 시간:', Date.now());
        console.log('마지막 업데이트 시간:', lastUpdated);
        console.log('캐시 유효 시간(ms):', cacheDuration);
        console.log('시간 차이(ms):', lastUpdated ? (Date.now() - lastUpdated) : 'lastUpdated 없음');

        // 데이터가 없거나, 강제 갱신이거나, 캐시가 만료되었을 때만 API 호출
        if (force || !recommendations.length || !lastUpdated || (Date.now() - lastUpdated >= cacheDuration)) {
            console.log('=== API 호출 수행 ===');
            console.log('호출 이유:',
                force ? '강제 갱신' :
                    !recommendations.length ? '데이터 없음' :
                        !lastUpdated ? 'lastUpdated 없음' :
                            ' 캐시 만료');

            try {
                setLoading(true);
                setError(null);
                console.log('API 호출 시작:', `/recommendation?num=${numRecommendations}`);
                const movies = await getRecommendations(numRecommendations);
                console.log('API 호출 성공, 데이터 개수:', movies.length);

                // 장르별 영화 카운트 (인기 장르 파악용)
                const genreCounts = new Map<number, number>();

                // 모든 장르 정보 수집
                movies.forEach((movie : Movie) => {
                    movie.genre.forEach(genre => {
                        const count = genreCounts.get(genre.id) || 0;
                        genreCounts.set(genre.id, count + 1);
                    });
                });

                // 인기 장르 선별 (minGenreCount 이상)
                const popularGenres: Genre[] = [];
                const popularGenreIds = new Set<number>();

                Array.from(genreCounts.entries())
                    .sort((a, b) => b[1] - a[1]) // 영화 개수가 많은 순으로 정렬
                    .forEach(([genreId, count]) => {
                        if (count >= minGenreCount) {
                            const genreName = movies.find((movie : Movie) =>
                                movie.genre.some(g => g.id === genreId)
                            )?.genre.find((g: Genre) => g.id === genreId)?.name;

                            if (genreName) {
                                popularGenres.push({ id: genreId, name: genreName });
                                popularGenreIds.add(genreId);
                            }
                        }
                    });

                // '그외' 장르 추가 부분 제거

                // 각 장르별로 영화 분류
                const moviesByGenreData: MovieByGenre[] = [];

                // 인기 장르별 영화 추가
                popularGenres.forEach(genre => {
                    const genreMovies = movies.filter((movie : Movie) =>
                        movie.genre.some(g => g.id === genre.id)
                    );

                    if (genreMovies.length > 0) {
                        moviesByGenreData.push({
                            genreId: genre.id,
                            genreName: genre.name,
                            movies: genreMovies
                        });
                    }
                });

                // '그외' 카테고리 처리 부분 제거

                // 스토어에 데이터 저장
                setRecommendations({
                    movies,
                    moviesByGenre: moviesByGenreData,
                    genres: popularGenres // '그외' 장르 없는 인기 장르만 저장
                });

                console.log('스토어 데이터 업데이트 완료');
                setLoading(false);
                setError(null);
                return true; // 성공적으로 새 데이터를 가져옴
            } catch (err) {
                console.error('영화 추천을 가져오는데 실패했습니다:', err);
                setError(err instanceof Error ? err : new Error('영화 추천을 가져오는데 실패했습니다'));
                setLoading(false);
                return false; // 데이터 가져오기 실패
            }
        } else {
            console.log('=== 캐시된 데이터 사용 ===');
            console.log('API 호출 스킵, 캐시된 데이터 사용 중');
            setError(null);
            return true; // 이미 최신 데이터가 있음
        }
    }, [recommendations, numRecommendations, minGenreCount, lastUpdated, cacheDuration, setLoading, setRecommendations, setError]);

    // 활성 장르 설정 함수 - ID로 설정
    const setGenreById = useCallback((genreId: number | null) => {
        setActiveGenreId(genreId);

        if (genreId === null) {
            setActiveGenreName(null);
            return;
        }

        // 장르 ID로 이름 찾기
        const genre = genres.find(g => g.id === genreId);
        if (genre) {
            setActiveGenreName(genre.name);
        }
    }, [genres]);

    // 활성 장르 설정 함수 - 이름으로 설정
    const setGenreByName = useCallback((genreName: string | null) => {
        setActiveGenreName(genreName);

        if (genreName === null) {
            setActiveGenreId(null);
            return;
        }

        // 장르 이름으로 ID 찾기
        const genre = genres.find(g => g.name === genreName);
        if (genre) {
            setActiveGenreId(genre.id);
        }
    }, [genres]);

    // 활성 장르의 영화 목록 가져오기
    const getActiveGenreMovies = useCallback((): Movie[] => {
        if (activeGenreId === null) return [];
        return getMoviesByGenre(activeGenreId);
    }, [activeGenreId, getMoviesByGenre]);

    // 컴포넌트 마운트 시 데이터 가져오기
    const mountedRef = useRef(false);

    useEffect(() => {
        if (mountedRef.current) return;

        if (autoFetch && isHydrated) { // 하이드레이션 완료 후에만 호출
            mountedRef.current = true;
            fetchAndProcessRecommendations();
        }
    }, [autoFetch, fetchAndProcessRecommendations, isHydrated]); // isHydrated 의존성 추가

    return {
        // 데이터
        recommendations,
        moviesByGenre,
        genres,
        likedMovies,

        // 활성 장르 관련
        activeGenreId,
        activeGenreName,
        setGenreById,
        setGenreByName,
        getActiveGenreMovies,

        isHydrated, // 필요하다면 하이드레이션 상태도 반환

        // 상태와 액션
        isLoading,
        error,
        lastUpdated,
        toggleLikeMovie,
        getMoviesByGenre,
        fetchRecommendations: fetchAndProcessRecommendations,
    };
};