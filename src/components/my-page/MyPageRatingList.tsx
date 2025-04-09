import React from 'react';
import { Pencil, Star, StarHalf } from 'lucide-react';
import useMyRatings from '../../hooks/mypage/useMyRatings';
import { useUserStore } from '../../store/userStore';
import { Link } from 'react-router';
import useLoading from '../../hooks/useLoading';

const MyPageRatingList = () => {
  const user = useUserStore();
  const { ratings, isLoading } = useMyRatings(user.id);
  const { loadingIndicator } = useLoading();

  return (
    <div className="grid grid-cols-1 gap-6">
      {isLoading && loadingIndicator()}

      {ratings?.pages.map((page) => {
        return page.content.map((movie) => (
          <Link
            key={movie.movieId}
            to={`/movies/${movie.movieId}/ratings`}
            className="flex gap-4 p-4 bg-gray-8 rounded-lg hover:bg-gray-6 transition-colors">
            <div className="flex-shrink-0">
              <img
                src={movie.poster || '/no-poster-long.png'}
                alt={movie.title}
                className="w-[120px] h-[180px] object-cover rounded"
              />
            </div>

            <div className="flex flex-col gap-2 flex-grow">
              <h3 className="text-label-xl text-white font-bold">{movie.title}</h3>

              <div className="w-full h-[1px] bg-gray-4" />

              <div className="flex justify-between">
                <div className="w-fit flex gap-1 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="relative w-5 h-5">
                      <Star
                        size={20}
                        stroke={0}
                        className={`${value <= movie.value ? 'fill-citrus-honey' : 'fill-gray-2'}`}
                      />
                      <StarHalf
                        size={20}
                        stroke={0}
                        className={
                          'absolute top-0 left-0 ' + (value <= movie.value + 0.5 ? 'fill-citrus-honey' : 'fill-gray-2')
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-white text-paragraph-lg">{movie.content}</p>
            </div>
          </Link>
        ));
      })}
    </div>
  );
};

export default MyPageRatingList;
