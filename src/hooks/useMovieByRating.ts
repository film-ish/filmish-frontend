import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {MovieRating, RATING_RANGES, RatingRange, useAllMovieRatingsQueries} from "../api/rate/rateApi.ts";

// 평점별 영화 데이터 타입
export interface MoviesByRating {
    ratingRange: RatingRange;
    movies: MovieRating[];
}

// 커스텀 훅 옵션
interface UseMovieByRatingsOptions {
    numRecommendations?: number;
    pageSize?: number;
    enabled?: boolean;
}

export const useMovieByRatingsQuery = (options: UseMovieByRatingsOptions = {}) => {
    const {
        numRecommendations = 10,
        pageSize = 10,
        enabled = true
    } = options;

    const [activeRatingRange, setActiveRatingRange] = useState<RatingRange | null>(null);
    const [likedMovies, setLikedMovies] = useState<Set<string>>(new Set());

    const queryClient = useQueryClient();

    // 모든 평점별 영화 데이터 쿼리
    const ratingQueries = useAllMovieRatingsQueries(numRecommendations, pageSize, enabled);

    // 로딩 상태 확인
    const isLoading = ratingQueries.some(query => query.isLoading);

    // 에러 상태 확인
    const errors = ratingQueries.filter(query => query.error).map(query => query.error);
    const error = errors.length > 0 ? errors[0] : null;

    // 데이터 변환
    const moviesByRating: MoviesByRating[] = ratingQueries.map((query, index) => {
        const ratingRange = RATING_RANGES[index];
        const movies = query.data?.data?.content || [];
        return { ratingRange, movies };
    });

    // 평점 범위 설정
    const setRatingRangeById = useCallback((ratingId: string | null) => {
        if (!ratingId) {
            setActiveRatingRange(null);
            return;
        }

        const ratingRange = RATING_RANGES.find(range => range.id === ratingId) || null;
        setActiveRatingRange(ratingRange);
    }, []);

    // 영화 좋아요 토글
    const toggleLikeMovie = useCallback((movieId: string) => {
        setLikedMovies(prev => {
            const newLikedMovies = new Set(prev);
            if (newLikedMovies.has(movieId)) {
                newLikedMovies.delete(movieId);
            } else {
                newLikedMovies.add(movieId);
            }
            return newLikedMovies;
        });
    }, []);

    // 데이터 새로고침
    const fetchMoviesByRating = useCallback((force: boolean = false) => {
        if (force) {
            // 모든 평점 범위의 쿼리를 무효화하고 다시 가져오기
            RATING_RANGES.forEach(ratingRange => {
                queryClient.invalidateQueries({
                    queryKey: ['moviesByRating', ratingRange.id]
                });
            });
        }
    }, [queryClient]);

    return {
        moviesByRating,
        ratingRanges: RATING_RANGES,
        likedMovies,
        isLoading,
        error,
        activeRatingRange,
        setRatingRangeById,
        toggleLikeMovie,
        fetchMoviesByRating
    };
};