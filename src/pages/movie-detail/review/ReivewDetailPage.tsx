import { useNavigate, useParams } from 'react-router';
import { X } from 'lucide-react';
import { useState } from 'react';
import CommentForm from '../../../components/movie-detail/common/CommentForm';
import IconButton from '../../../components/common/IconButton';
import CommentCard from '../../../components/movie-detail/reviews/detail/CommentCard';
import useReview from '../../../hooks/review/useReview';
import useComment from '../../../hooks/comment/useCemment';
import ReviewSection from '../../../components/movie-detail/reviews/detail/ReviewSection';
import { useUserStore } from '../../../store/userStore';

const ReviewDetailPage = () => {
  const { movieId, reviewId } = useParams();
  const navigate = useNavigate();
  const user = useUserStore();

  const [isNavigating, setIsNavigating] = useState(false);

  const { review, updateReview, deleteReview } = useReview(movieId, reviewId, navigate);

  const { comments, createComment, updateComment, deleteComment } = useComment(reviewId);

  const [animation, setAnimation] = useState<'in' | 'out'>('in');

  const navigateAfterTransition = () => {
    if (isNavigating) return;

    setIsNavigating(true);
    setAnimation('out');
    const timer = setTimeout(() => {
      navigate(`/movies/${movieId}/reviews#${reviewId}`);
      setIsNavigating(false);
      return () => clearTimeout(timer);
    }, 500);
  };

  const onSubmitComment = async (content: string) => {
    createComment({ content });

    const scrollHeight = document.querySelector('#review-detail')?.scrollHeight;

    const interval = setInterval(() => {
      if (scrollHeight !== document.querySelector('#review-detail')?.scrollHeight) {
        requestAnimationFrame(() => {
          const container = document.querySelector('#review-detail');
          container?.scrollTo({ top: container.scrollHeight + 500, behavior: 'smooth' });
        });
        clearInterval(interval);
      }
    }, 10);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0" onClick={navigateAfterTransition}>
        <div
          onClick={(e) => e.stopPropagation()}
          className={
            'fixed bottom-0 right-0 w-1/2 h-[calc(100vh-110px)] flex flex-col justify-end overflow-x-hidden ' +
            (animation === 'in' ? 'animate-slidein' : 'animate-slideout')
          }>
          <div
            id="review-detail"
            className="movie-detail-scrollbar relative w-full flex flex-col gap-2 p-6 pt-0 pb-24 bg-gray-7 rounded-tl-[10px]"
            style={{ height: 'calc(100% - 1.5rem)' }}>
            <div className="z-10 sticky top-0 py-2 w-full flex justify-end bg-gray-7/95">
              <IconButton size={30} onClick={navigateAfterTransition}>
                <X />
              </IconButton>
            </div>

            {review && <ReviewSection review={review} updateReview={updateReview} deleteReview={deleteReview} />}

            <div className="w-full h-[1px] bg-gray-0" />

            <div className="w-full flex flex-col gap-4">
              <div className="text-label-lg font-bold">댓글 {comments?.pages[0]?.length.toLocaleString()}개</div>
              <CommentForm
                className="w-full"
                submitButtonColor="cherry-blush"
                onSubmit={onSubmitComment}
                showCancel={false}
                placeholder="댓글을 입력하세요 (최대 50자)"
              />

              {comments?.pages.map((page) => {
                return page?.map((comment) => {
                  return (
                    <CommentCard
                      key={comment.id}
                      reviewId={reviewId}
                      comment={comment}
                      isOwner={comment.writer === user.nickname}
                      onAddComment={(commentId, content) => {
                        createComment({ content, parentCommentId: commentId });
                      }}
                      onUpdateComment={(commentId, content) => {
                        updateComment({ commentId, content });
                      }}
                      onDeleteComment={deleteComment}
                    />
                  );
                });
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewDetailPage;
