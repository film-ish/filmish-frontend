import React from 'react';

interface LikedMovie {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  runtime: string;
  thumbnail: string;
}

const LikePage = () => {
  const likedMovies: LikedMovie[] = [
    {
      id: 1,
      title: '스플라이스 썸머 픽지',
      genre: '드라마',
      releaseDate: '2023',
      runtime: '108분',
      thumbnail: '/path/to/thumbnail1.jpg',
    },
    // 더미 데이터...
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-8">좋아요</h1>
      <div className="grid grid-cols-1 gap-4">
        {likedMovies.map((movie) => (
          <div key={movie.id} className="flex gap-4 p-4 bg-gray-7 rounded-lg hover:bg-gray-6 transition-colors">
            <div className="flex-shrink-0">
              <img src={movie.thumbnail} alt={movie.title} className="w-[120px] h-[180px] object-cover rounded" />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-lg text-white font-medium mb-2">{movie.title}</h3>
              <p className="text-sm text-gray-400">
                {movie.releaseDate} · {movie.genre} · {movie.runtime}
              </p>
            </div>
            <div className="ml-auto flex items-center">
              <button className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LikePage;
