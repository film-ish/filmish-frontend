import React from 'react';

interface Comment {
  id: number;
  content: string;
  movieTitle: string;
  date: string;
  likes: number;
}

const CommentsPage = () => {
  const comments: Comment[] = [
    {
      id: 1,
      content: '정말 재미있는 영화였어요!',
      movieTitle: '귀울을 바이러스가 장악한 세상',
      date: '2025.03.12',
      likes: 5,
    },
    // 더미 데이터...
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-8">댓글</h1>
      <div className="grid grid-cols-1 gap-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-gray-7 rounded-lg hover:bg-gray-6 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="text-white mb-2">{comment.content}</p>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>{comment.movieTitle}</span>
                  <span>{comment.date}</span>
                  <span>좋아요 {comment.likes}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white ml-4">
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

export default CommentsPage;
