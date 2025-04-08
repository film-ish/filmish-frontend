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

  const [showReviewForm, setShowReviewForm] = useState(false);

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

        {(showReviewForm || reviews.pages[0].length === 0) && (
          <ReviewForm
            onClickCancel={() => {
              setShowReviewForm(false);
            }}
            createReview={createReview}
            setShowReviewForm={setShowReviewForm}
          />
        )}

        <div className="flex flex-col gap-6 pb-20">
          <div className="w-full h-[1px] bg-gray-6" />

          {reviews.pages.map((page) => {
            return page.map((review, index) => {
              return (
                <>
                  <ReviewCard key={review.id} review={review} />
                  {index !== page.length - 1 && <div className="w-full h-[1px] bg-gray-6" />}
                </>
              );
            });
          })}
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default MovieReviewsPage;
