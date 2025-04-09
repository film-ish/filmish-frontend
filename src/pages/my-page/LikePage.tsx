import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useUserStore } from '../../store/userStore';
import { userService } from '../../api/user';
import { Link } from 'react-router';
import { Star } from 'lucide-react';
import LikeButton from '../../components/movie/LikeButton';
import { movieService } from '../../api/movie';

interface Maker {
  id: number;
  name: string;
  type: string;
  thumbnailImage: string | null;
}

interface LikedMovie {
  id: number;
  title: string;
  plot: string;
  pubDate: string | null;
  runningTime: number;
  averageRating: number;
  type: string;
  poster: string | null;
  stillcut: string | null;
  makers: Maker[];
}

const LikePage = () => {
  const user = useUserStore();

  const queryClient = useQueryClient();

  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['my-like-list', user.id],
    queryFn: async ({ pageParam }) => {
      const response = await userService.getMyLikeList(user.id, pageParam);
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPageParam + 1;
    },
    staleTime: 1 * 1000,
    enabled: user.id === 0 || !!user.id,
    placeholderData: {
      pages: [{}],
    },
  });

  const { mutate: likeMovie } = useMutation({
    mutationFn: async (movieId: number) => {
      const response = await movieService.likeMovie(movieId);
      return response;
    },
    onSuccess: (_, movieId) => {
      queryClient.setQueryData(['my-like-list', user.id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.map((movie: LikedMovie) => {
              if (movie.id === movieId) {
                return {
                  ...movie,
                  liked: !movie.liked,
                };
              }
              return movie;
            }),
          })),
        };
      });
    },
  });

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-8">보고 싶어요</h1>
      {isLoading && <div className="w-full h-full flex items-center justify-center">로딩 중..</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {data?.pages.map((page) => {
          return page?.content?.map((movie: LikedMovie) => {
            return (
              <Link
                to={`/movies/${movie.id}`}
                key={movie.id}
                className="flex flex-col gap-2 rounded-[10px] overflow-hidden transition-colors">
                <div className="w-full aspect-[1/1.4] relative rounded-[10px] overflow-hidden">
                  <img
                    src={movie.poster || movie.stillcut || '/no-poster.png'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />

                  <LikeButton
                    liked={movie.liked}
                    movieId={movie.id}
                    onClick={(e) => {
                      e.preventDefault();
                      likeMovie(movie.id);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex w-full justify-between">
                    <h3 className="text-lg text-white font-medium truncate">{movie.title}</h3>

                    <div className="flex items-center">
                      <Star size={20} fill="#ffe68a" stroke={0} />
                      <div className="flex items-center gap-2">{movie.value.toFixed(1)}</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400">
                    {movie.genres[0]} · {movie.runningTime}분
                  </p>
                </div>
              </Link>
            );
          });
        })}
      </div>
    </>
  );
};

export default LikePage;
