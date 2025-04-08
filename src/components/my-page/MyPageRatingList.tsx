import React from 'react';
import { Pencil, Star, StarHalf } from 'lucide-react';

interface MovieRating {
  movieId: number;
  poster: string;
  ratingId: number;
  title: string;
  content: string;
  value: number;
}

const MyPageRatingList = () => {
  const ratings: MovieRating[] = [
    {
      movieId: 1,
      poster: 'http://file.koreafilm.or.kr/still/copy/00/50/10/DSKT302307_01.jpg',
      ratingId: 101,
      title: '수능을 치려면',
      content: '증말 재있었습니다 👍',
      value: 4.5,
    },
    {
      movieId: 2,
      poster: 'https://file.koreafilm.or.kr/still/copy/00/65/30/DST821192_01.jpg',
      ratingId: 102,
      title: '메리!',
      content: '증말 재있었습니다 👍',
      value: 4.0,
    },
    {
      movieId: 3,
      poster: 'https://file.koreafilm.or.kr/still/copy/00/65/30/DST821192_01.jpg',
      ratingId: 103,
      title: '스플라이스 썸머 픽지',
      content: '증말 재있었습니다 👍',
      value: 0.5,
    },
    // 더미 데이터...
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {ratings.map((movie) => (
        <div key={movie.movieId} className="flex gap-4 p-4 bg-gray-8 rounded-lg hover:bg-gray-6 transition-colors">
          <div className="flex-shrink-0">
            <img src={movie.poster} alt={movie.title} className="w-[120px] h-[180px] object-cover rounded" />
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

              <button className="text-gray-400 hover:text-white">
                <Pencil size={20} />
              </button>
            </div>

            <p className="text-white text-paragraph-lg">{movie.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPageRatingList;
