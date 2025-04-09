import { useInfiniteQuery } from '@tanstack/react-query';
import { useUserStore } from '../../store/userStore';
import { userService } from '../../api/user';
import { Link } from 'react-router';
import ProfileImage from '../../components/common/ProfileImage';
import { getTimeAgo } from '../../utils/date';
import { Fragment } from 'react/jsx-runtime';
import { objArrayToValueArray } from '../../utils/array';

const ReviewCommentsPage = () => {
  const user = useUserStore();

  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['my-review-comment-list', user.id],
    queryFn: async ({ pageParam }) => {
      const response = await userService.getMyReviewCommentList(user.id, pageParam, 100);

      console.log(response);

      const newContent = response.data.content.map((review) => {
        return { ...review, images: objArrayToValueArray(review.images, 'path') };
      });

      return { ...response.data, content: newContent };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return lastPageParam + 1;
    },
    staleTime: 1 * 1000,
    enabled: user.id === 0 || !!user.id,
    placeholderData: {
      pages: [{}],
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-white">내가 댓글을 남긴 리뷰</h1>

      {isLoading && <div className="w-full h-full flex items-center justify-center">로딩 중..</div>}

      <div className="w-full h-[1px] bg-gray-6" />

      {data?.pages.map((page) => {
        const reviewIdArr = [];
        return page.content?.map((review, index) => {
          if (reviewIdArr.includes(review.reviewId)) return null;
          reviewIdArr.push(review.reviewId);
          return (
            <Fragment key={review.reviewId}>
              <Link
                to={`/movies/${review.movieId}/reviews/${review.reviewId}`}
                className="w-full flex items-center gap-4"
                style={{ contentVisibility: 'auto' }}>
                {review.images.length > 0 && (
                  <div className="shrink-0 w-[100px] h-fit aspect-square relative flex items-center justify-center rounded-[10px] overflow-hidden">
                    <img className="w-full h-full object-cover" src={review.images[0]} alt="review thumbnail" />
                  </div>
                )}

                <div className="w-full max-h-[120px] flex flex-col gap-2">
                  <div className="text-label-lg font-bold">{review.title}</div>
                  <div className="text-paragraph-md line-clamp-2 text-ellipsis">{review.content}</div>

                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ProfileImage size={30} src={review.writerImage} />
                      <div className="text-label-md">{review.writerName}</div>
                    </div>
                    <div className="text-label-sm text-gray-4">{getTimeAgo(review.updatedAt || review.createdAt)}</div>
                  </div>
                </div>
              </Link>

              {index !== page.content.length - 1 && <div className="w-full h-[1px] bg-gray-6" />}
            </Fragment>
          );
        });
      })}
    </div>
  );
};

export default ReviewCommentsPage;
