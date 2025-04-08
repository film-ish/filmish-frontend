import { useQuery, useQueries } from '@tanstack/react-query';
import {apiClient} from "../instance/client.ts";

/**
 * 응답 데이터 타입 정의
 */
export interface MovieRatingResponse {
    message: string;
    code: string;
    data: {
        content: MovieRating[];
        pageable: {
            pageNumber: number;
            pageSize: number;
            sort: {
                unsorted: boolean;
                sorted: boolean;
                empty: boolean;
            };
            offset: number;
            unpaged: boolean;
            paged: boolean;
        };
        last: boolean;
        totalElements: number;
        totalPages: number;
        first: boolean;
        numberOfElements: number;
        size: number;
        number: number;
        sort: {
            unsorted: boolean;
            sorted: boolean;
            empty: boolean;
        };
        empty: boolean;
    };
}

export interface MovieRating {
    movieId: number;
    title: string;
    posterUrl: string;
    averageRating: number;
}

/**
 * 평점별 영화 목록을 조회하는 API 함수
 */
export const fetchMoviesByRating = async (
    num: number,
    minValue: number,
    maxValue: number,
    pageNum: number = 1,
    pageSize: number = 20
): Promise<MovieRatingResponse> => {
    const response = await apiClient.get('/recommendation/rates', {
        params: {
            num,
            minValue,
            maxValue,
            pageNum,
            pageSize
        }
    });
    return response.data;
};

/**
 * 평점 범위 타입 정의
 */
export interface RatingRange {
    id: string;
    label: string;
    minValue: number;
    maxValue: number;
}

/**
 * 평점 범위 상수 정의
 */
export const RATING_RANGES: RatingRange[] = [
    { id: 'rating-5', label: '5점대', minValue: 5, maxValue: 5.1 },
    { id: 'rating-4.5', label: '4.5점대', minValue: 4.5, maxValue: 4.99 },
    { id: 'rating-4', label: '4점대', minValue: 4, maxValue: 4.49 },
    { id: 'rating-3.5', label: '3.5점대', minValue: 3.5, maxValue: 3.99 },
    { id: 'rating-3', label: '3점대', minValue: 3, maxValue: 3.49 }
];

/**
 * 단일 평점 범위의 영화 데이터를 가져오는 쿼리 훅
 */
export const useMovieRatingQuery = (
    ratingRange: RatingRange,
    numRecommendations: number = 20,
    pageSize: number = 10,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: ['moviesByRating', ratingRange.id, numRecommendations, pageSize],
        queryFn: () => fetchMoviesByRating(
            numRecommendations,
            ratingRange.minValue,
            ratingRange.maxValue,
            1,
            pageSize
        ),
        enabled,
        staleTime: 10 * 60 * 1000, // 10분 동안 데이터를 신선한 상태로 유지
        cacheTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    });
};

/**
 * 모든 평점 범위의 영화 데이터를 병렬로 가져오는 쿼리 훅
 */
export const useAllMovieRatingsQueries = (
    numRecommendations: number = 20,
    pageSize: number = 10,
    enabled: boolean = true
) => {
    return useQueries({
        queries: RATING_RANGES.map(ratingRange => ({
            queryKey: ['moviesByRating', ratingRange.id, numRecommendations, pageSize],
            queryFn: () => fetchMoviesByRating(
                numRecommendations,
                ratingRange.minValue,
                ratingRange.maxValue,
                1,
                pageSize
            ),
            enabled,
            staleTime: 10 * 60 * 1000, // 10분 동안 데이터를 신선한 상태로 유지
            cacheTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
        }))
    });
};