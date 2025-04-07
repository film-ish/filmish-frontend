// hooks/useGenres.ts
import { useQuery } from '@tanstack/react-query';
import {getGenres} from "../api/genre/getGenres.ts";

export const useGenres = () => {
    return useQuery({
        queryKey: ['genres'],
        queryFn: getGenres,
        staleTime: Infinity, // 10분간 데이터 신선 유지
        gcTime: Infinity, // 60분간 캐시 유지
    });
};