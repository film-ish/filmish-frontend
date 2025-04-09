import { useParams } from 'react-router';
import RatingCard from '../../components/movie-detail/ratings/RatingCard';
import RatingsGraph from '../../components/movie-detail/ratings/RatingsGraph';
import RatingsAverage from '../../components/movie-detail/ratings/RatingsAverage';
import { useState, useEffect } from 'react';
import { CommentFormData } from '../../types/comment';
import { getTimeAgo } from '../../utils/date';
import CommentForm from '../../components/movie-detail/common/CommentForm';
import useRatings from '../../hooks/ratings/useRatings';
import { useUserStore } from '../../store/userStore';

const MovieRatingsPage = () => {
  const { movieId } = useParams();

  const user = useUserStore();

  const [isEditing, setIsEditing] = useState(false);

  const { totalRatingsCount, ratings, createRating, updateRating, deleteRating } = useRatings(movieId);
  const [myRating, setMyRating] = useState<Rating | null>(null);

  useEffect(() => {
    const myRating = ratings?.[0]?.content?.find((comment) => comment.writerName == user.nickname);
    setMyRating(myRating);
  }, [ratings, user.nickname]);

  const addComment = (content: string, rating: number) => {
    createRating({ rating, content });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (confirm('삭제하시겠습니까?')) {
      deleteRating(myRating.id);
      setMyRating(null);
    }
  };

  const onSubmitEditedRating = (content: string, rating: number) => {
    setIsEditing(false);

    if (content.trim() === myRating.content.trim() && rating === myRating.value) {
      return;
    }

    updateRating({ ratingId: myRating.id, rating, content });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex gap-4">
        <RatingsAverage totalCounts={totalRatingsCount} avgScore={ratings[0].averageRating || 0} />
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
              onSubmit={onSubmitEditedRating}
              initialContent={myRating.content}
              initialRating={myRating.value}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <RatingCard comment={myRating} onClickEdit={handleEdit} onClickDelete={handleDelete} />
            </div>
          )
        ) : (
          <CommentForm
            showRating
            showCancel={false}
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
