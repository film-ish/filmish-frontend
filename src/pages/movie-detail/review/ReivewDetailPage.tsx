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

  const { review, updateReview, deleteReview } = useReview(movieId, reviewId, navigate);

  const { comments, createComment, updateComment, deleteComment, deleteCocomment } = useComment(reviewId);

  const [animation, setAnimation] = useState<'in' | 'out'>('in');

  const navigateAfterTransition = () => {
    setAnimation('out');
    const timer = setTimeout(() => {
      navigate(-1);
      return () => clearTimeout(timer);
    }, 500);
  };

  return (
    <div
      className={
        'absolute top-0 left-0 w-full h-full flex flex-col justify-end overflow-x-hidden ' +
        (animation === 'in' ? 'animate-slidein' : 'animate-slideout')
      }>
      <div
        className="movie-detail-scrollbar relative w-full flex flex-col gap-4 p-6 pt-0 pb-24 bg-gray-7 rounded-tl-[10px]"
        style={{ height: 'calc(100% - 1.5rem)' }}>
        <div className="z-10 sticky top-0 left-[1.5rem] py-2 w-full flex justify-end bg-gray-7">
          <IconButton onClick={navigateAfterTransition}>
            <X />
          </IconButton>
        </div>

        {review && <ReviewSection review={review} updateReview={updateReview} deleteReview={deleteReview} />}

        <hr />

        <div className="w-full flex flex-col gap-4">
          <div className="text-label-lg font-bold">댓글 {comments?.pages[0]?.length.toLocaleString()}개</div>
          <CommentForm
            submitButtonColor="cherry-blush"
            onSubmit={(content) => {
              createComment({ content });
            }}
            showCancel={false}
            placeholder="댓글을 입력하세요"
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
                    console.log(commentId, content);
                    createComment({ content, parentCommentId: commentId });
                  }}
                  onUpdateComment={(input) => {
                    updateComment(input);
                  }}
                  onDeleteComment={deleteComment}
                  onDeleteCocomment={deleteCocomment}
                />
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
