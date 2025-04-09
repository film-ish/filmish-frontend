import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Outlet, useLocation, useParams } from 'react-router';
import MoviePoster from '../components/movie/MoviePoster';
import { Star } from 'lucide-react';
import Tag from '../components/common/Tag';
import MovieDetailTap from '../components/movie-detail/MovieDetailTap';
import { movieService } from '../api/movie';
import { useUserStore } from '../store/userStore';

const MovieDetailLayout = () => {
  const movieId = Number(useParams().movieId);
  const queryClient = useQueryClient();
  const user = useUserStore();
  const location = useLocation();

  const { data: movieData, isLoading } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      const response = await movieService.getMovieDetail(movieId);
      const posters = response.data.posters?.map((poster) => poster.replace('망함', ''));

      return {
        ...response.data,
        posters,
      };
    },
    staleTime: 1 * 1000,
    enabled: !!movieId,
    placeholderData: {
      id: movieId,
      title: '',
      plot: '',
      pubDate: null,
      runningTime: 0,
      averageRating: 0,
      type: '',
      posters: ['/no-poster.png'],
      stillcuts: [],
      makers: [],
      keywords: '',
      like: false,
    },
  });

  const { mutate: likeMovie } = useMutation({
    mutationFn: async () => {
      const response = await movieService.likeMovie(movieId, !movieData?.like);
      console.log(response);
      return response;
    },
    onSuccess: () => {
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
                  like: !movie.like,
                };
              }
              return movie;
            }),
          })),
        };
      });

      queryClient.setQueryData(['movie', movieId], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          like: !oldData.like,
        };
      });
    },
  });

  return (
    <div className="relative flex w-screen h-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] -mt-[3.75rem] p-[70px] bg-cover bg-center overflow-hidden">
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black">
        <img
          src={movieData?.stillcuts?.[0]}
          alt="movie poster"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.2)' }}
        />
      </div>

      <div className="flex justify-between w-full h-full relative z-10">
        {/* 좌측 화면 */}
        <div className="flex flex-col gap-4 self-end">
          <MoviePoster
            posterSrc={movieData?.posters?.[0] || movieData?.stillcuts?.[0]}
            width={250}
            liked={movieData?.like}
            onLike={likeMovie}
          />

          <div>
            <div className="text-heading-lg">{movieData?.title}</div>
            <div className="flex text-label-xxl gap-5">
              <div className="flex items-center">
                <Star className="fill-rose-cloud" stroke={0} />
                {movieData?.averageRating?.toFixed(1)}
              </div>

              <div className="flex gap-2">
                {movieData?.keywords?.split(',').map((genre, index) => {
                  if (index >= 5) {
                    return null;
                  }
                  return (
                    <Tag key={genre} size="x-small" bgColor="white/50">
                      #{genre}
                    </Tag>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 우측 화면 */}
        <div className="w-7/12 mr-[-70px] mb-[-70px]">
          <MovieDetailTap />
          <div
            className={
              'relative flex-1 h-[calc(100vh-110px)] p-6 bg-gray-8/85 overflow-x-hidden movie-detail-scrollbar ' +
              (location.pathname.split('/reviews/').length === 2 ? 'overflow-y-hidden' : '')
            }>
            <Outlet context={movieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailLayout;
