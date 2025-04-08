import { useQuery } from '@tanstack/react-query';
import { Outlet, useParams } from 'react-router';
import MoviePoster from '../components/movie/MoviePoster';
import { Star } from 'lucide-react';
import Tag from '../components/common/Tag';
import MovieDetailTap from '../components/movie-detail/MovieDetailTap';
import formatRating from '../utils/rating';
import { movieService } from '../api/movie';
import { useEffect } from 'react';

const MovieDetailLayout = () => {
  const movieId = Number(useParams().movieId);

  const movieQuery = useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      const response = await movieService.getMovieDetail(movieId);

      console.log(response);

      const stillcuts = response.data.stillcuts;
      const newStillcuts = [];

      stillcuts.forEach((item) => {
        newStillcuts.push(Object.values(item));
      });

      const newResponse = {
        ...response.data,
        stillcuts: newStillcuts,
      };

      return newResponse;
    },
    staleTime: 10 * 1000,
    enabled: !!movieId,
    placeholderData: {
      id: movieId,
      title: '',
      plot: '',
      pubDate: null,
      runningTime: 0,
      averageRating: 0,
      type: '',
      poster: null,
      stillcuts: [],
      makers: [],
      keywords: '',
    },
  });

  return (
    <div
      className="relative w-screen h-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] -mt-[3.75rem] p-[70px] bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${movieQuery.data?.stillcuts[0]})` }}>
      <div className="absolute inset-0 bg-black/50" />

      <div className="w-full h-full relative z-10 flex">
        {/* 좌측 화면 */}
        <div className="w-full flex flex-col gap-4 self-end">
          <MoviePoster
            posterSrc={movieQuery.data?.poster || movieQuery.data?.stillcuts[0]}
            width={250}
            liked={false}
            onLike={() => {}}
          />

          <div>
            <div className="text-heading-lg">{movieQuery.data?.title}</div>
            <div className="flex text-label-xxl gap-5">
              <div className="flex items-center">
                <Star className="fill-rose-cloud" stroke={0} />
                {formatRating(movieQuery.data?.averageRating || 0)}
              </div>

              <div className="flex gap-2">
                {movieQuery.data?.keywords?.split(',').map((genre, index) => {
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
        <div className="w-full mr-[-70px] mb-[-70px]">
          <MovieDetailTap />
          <div className="relative flex-1 h-[calc(100vh-110px)] p-6 bg-gray-8/85 overflow-x-hidden movie-detail-scrollbar">
            <Outlet context={movieQuery.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailLayout;
