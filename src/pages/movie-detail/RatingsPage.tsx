import { useParams } from 'react-router';
import RatingCard from '../../components/movie-detail/ratings/RatingCard';
import RatingsGraph from '../../components/movie-detail/ratings/RatingsGraph';
import RatingsAverage from '../../components/movie-detail/ratings/RatingsAverage';
import { useState } from 'react';
import { CommentFormData } from '../../types/comment';
import { getTimeAgo } from '../../utils/date';
import CommentForm from '../../components/movie-detail/common/CommentForm';
import useRatings from '../../hooks/ratings/useRatings';
import { useUserStore } from '../../store/userStore';

const MovieRatingsPage = () => {
  const { movieId } = useParams();

  const user = useUserStore();

  const [isEditing, setIsEditing] = useState(false);

  const { totalRatingsCount, ratings, createRating, updateRating } = useRatings(movieId);

  const addComment = (content: string, rating: number) => {
    createRating({ rating, content });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const myRating = ratings[0].content.find((comment) => comment.writerName == user.nickname);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex gap-4">
        <RatingsAverage totalCounts={totalRatingsCount} avgScore={ratings[0].averageRating} />
        <RatingsGraph totalCounts={totalRatingsCount} ratings={ratings[0].ratingsCount} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="font-bold">코멘트 {totalRatingsCount ? totalRatingsCount.toLocaleString() : 0}개</div>

        {myRating ? (
          isEditing ? (
            <CommentForm
              showRating
              ratingStep={0.5}
              onCancel={() => setIsEditing(false)}
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
            if (comment.writerName === user.nickname) return null;

            if (comment.id) {
              return <RatingCard key={`${comment.id}-page-${page.number}`} comment={comment} />;
            }
          });
        })}
      </div>
    </div>
  );
};

export default MovieRatingsPage;
