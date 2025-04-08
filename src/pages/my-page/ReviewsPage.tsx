import { Fragment } from 'react';
import ProfileImage from '../../components/common/ProfileImage';
import { Link, useOutletContext } from 'react-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { userService } from '../../api/user';

const MyReviewsPage = () => {
  const { user } = useOutletContext();

  const myReviewsQuery = useInfiniteQuery({
    queryKey: ['my-reviews', user.userId],
    queryFn: async ({ pageParam }) => {
      const response = await userService.getMyReviewList(user.userId, pageParam);
      return response.data;
    },
    select: (data) => ({
      pages: data.pages,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPageParam + 1;
    },
    staleTime: 1 * 1000,
    enabled: user.userId === 0 || !!user.userId,
    placeholderData: {
      pages: [
        {
          reviews: [],
        },
      ],
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-white">리뷰</h1>
      <div className="grid grid-cols-1 gap-6">
        {myReviewsQuery.data.pages.map((group, i) => (
          <Fragment key={i}>
            {group.reviews.map((review) => (
              <Link
                key={review.reviewId}
                to={`/movies/${review.movieId}/reviews/${review.reviewId}`}
                className="flex gap-4 p-4 bg-gray-7 rounded-lg hover:bg-gray-6 transition-colors">
                {review.img && (
                  <div className="shrink-0 w-[120px] h-fit aspect-square relative flex items-center justify-center rounded-[10px] overflow-hidden">
                    <img className="w-full h-full object-cover" src={review.img} alt="review thumbnail" />
                  </div>
                )}

                <div className="w-full h-[120px] flex flex-col justify-between">
                  <div className="text-label-lg font-bold">{review.title}</div>
                  <div className="text-paragraph-md line-clamp-2 text-ellipsis">{review.content}</div>

                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ProfileImage size={30} src={user.image} />
                      <div className="text-label-md">{user.nickname}</div>
                    </div>
                    <div className="text-label-sm text-gray-4">{review.createdAt}</div>
                  </div>
                </div>
              </Link>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default MyReviewsPage;
