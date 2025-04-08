import { Outlet, useParams } from 'react-router';
import useReviews from '../../../hooks/review/useReviews';
import { useState } from 'react';
import Button from '../../../components/common/Button';
import ReviewCard from '../../../components/movie-detail/reviews/ReviewCard';
import ReviewForm from '../../../components/movie-detail/reviews/ReviewForm';
import useReview from '../../../hooks/review/useReview';

const MovieReviewsPage = () => {
  const { movieId, reviewId } = useParams();
  const { reviews, getMoreReviews } = useReviews(movieId);

  const { createReview } = useReview(movieId, reviewId);

  const [showReviewForm, setShowReviewForm] = useState(!reviews.pages[0].length);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>리뷰 {reviews?.pages.flat().length}개</div>
          <Button
            shape="rounded-full"
            onClick={() => {
              setShowReviewForm(true);
            }}>
            리뷰 작성하기
          </Button>
        </div>

        {showReviewForm && (
          <ReviewForm
            onClickCancel={() => {
              setShowReviewForm(false);
            }}
            createReview={createReview}
            setShowReviewForm={setShowReviewForm}
          />
        )}

        <div className="flex flex-col gap-6">
          {reviews.pages.map((page) => {
            return page.map((review) => <ReviewCard key={review.id} review={review} />);
          })}
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default MovieReviewsPage;
