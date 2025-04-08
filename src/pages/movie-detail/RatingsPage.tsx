import { useOutletContext, useParams } from 'react-router';
import RatingCard from '../../components/movie-detail/ratings/RatingCard';
import RatingsGraph from '../../components/movie-detail/ratings/RatingsGraph';
import RatingsAverage from '../../components/movie-detail/ratings/RatingsAverage';
import { useState } from 'react';
import { CommentFormData } from '../../types/comment';
import { getKoreanDate } from '../../utils/date';
import CommentForm from '../../components/movie-detail/common/CommentForm';
import useRatings from '../../hooks/ratings/useRatings';

const MovieRatingsPage = () => {
  const { movieId } = useParams();
  const { averageRating } = useOutletContext();

  const [isEditing, setIsEditing] = useState(false);

  const { totalRatingsCount, ratings, createRating, updateRating } = useRatings(movieId);

  const addComment = (content: string, rating: number) => {
    const newRating: CommentFormData = {
      movieId: movieId!,
      writerName: '준표', // 현재 사용자 닉네임으로 변경해야 함
      writerImage: null, // 현재 사용자 프로필 이미지로 변경해야 함
      content,
      value: rating,
      createdAt: getKoreanDate(),
      updatedAt: getKoreanDate(),
    };

    createRating({ rating, content });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const myRating = ratings[0].content.find((comment) => comment.writerName === 'qqqqqq');

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex gap-4">
        <RatingsAverage totalCounts={totalRatingsCount} avgScore={averageRating} />
        <RatingsGraph totalCounts={totalRatingsCount} ratings={ratings[0].ratingsCount} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="font-bold">코멘트 {totalRatingsCount ? totalRatingsCount.toLocaleString() : 0}개</div>

        {myRating ? (
          isEditing ? (
            <CommentForm
              showRating
              ratingStep={0.5}
              onSubmit={(content, rating) => {
                updateRating({ ratingId: myRating.id, rating, content });
                setIsEditing(false);
              }}
              initialContent={myRating.content}
              initialRating={myRating.value}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <RatingCard comment={myRating} />
              <button onClick={handleEdit} className="self-end text-sm text-gray-4 hover:text-white transition-colors">
                수정하기
              </button>
            </div>
          )
        ) : (
          <CommentForm
            showRating
            ratingStep={0.5}
            onSubmit={(content, rating) => {
              addComment(content, rating);
            }}
          />
        )}

        {ratings.map((page) => {
          return page.content.map((comment) => {
            return <RatingCard key={`${comment.id}-page-${page.number}`} comment={comment} />;
          });
        })}
      </div>
    </div>
  );
};

export default MovieRatingsPage;
