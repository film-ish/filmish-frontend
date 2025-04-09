import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { idbStorage } from '../lib/idbStorage';

// 영화 타입 정의
export interface Movie {
    id: number;
    title: string;
    genre: Array<{ id: number; name: string }>;
    runningTime: number;
    rates: number;
    img: string | null;
    stillcut: string | null;
}

// 장르 타입 정의
export interface Genre {
    id: number;
    name: string;
    image?: string;
}

// 장르별 영화 타입 정의
export interface MovieByGenre {
    genreId: number;
    genreName: string;
    movies: Movie[];
}

// 추천 데이터 세팅을 위한 타입
interface RecommendationData {
    movies: Movie[];
    moviesByGenre: MovieByGenre[];
    genres: Genre[];
}

// 추천 스토어 상태 타입 정의
interface RecommendState {
    // 데이터
    recommendations: Movie[];
    moviesByGenre: MovieByGenre[];
    genres: Genre[];
    likedMovies: Record<string, boolean>;

    // 상태
    isLoading: boolean;
    error: Error | null;
    lastUpdated: number | null;

    isHydrated: boolean;
    setHydrated: (hydrated: boolean) => void;

    // 액션
    setRecommendations: (data: RecommendationData) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: Error | null) => void;
    toggleLikeMovie: (movieId: string) => void;
    getMoviesByGenre: (genreId: number) => Movie[];
}

export const useRecommendStore = create<RecommendState>()(
    persist(
        (set, get) => ({
            // 초기 상태
            recommendations: [],
            moviesByGenre: [],
            genres: [],
            likedMovies: {},
            isLoading: false,
            error: null,
            lastUpdated: null,
            isHydrated: false,
            setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),


            // 추천 데이터 설정 (API 호출 결과를 받아서 처리)
            setRecommendations: ({ movies, moviesByGenre, genres }: RecommendationData) => {
                set({
                    recommendations: movies,
                    moviesByGenre,
                    genres,
                    lastUpdated: Date.now()
                });
            },

            // 로딩 상태 설정
            setLoading: (isLoading: boolean) => {
                set({ isLoading });
            },

            // 에러 상태 설정
            setError: (error: Error | null) => {
                set({ error });
            },

            // 영화 좋아요 토글
            toggleLikeMovie: (movieId: string) => {
                set(state => ({
                    likedMovies: {
                        ...state.likedMovies,
                        [movieId]: !state.likedMovies[movieId]
                    }
                }));
            },

            // 특정 장르의 영화 가져오기
            getMoviesByGenre: (genreId: number) => {
                const state = get();
                const genreData = state.moviesByGenre.find(item => item.genreId === genreId);
                return genreData ? genreData.movies : [];
            }
        }),
        {
            name: 'recommend-storage',
            storage: createJSONStorage(() => idbStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHydrated(true);
                }
            }
        }
    )
);