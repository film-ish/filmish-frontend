// routes.ts
export const ROUTES = {
  HOME: '/',
  MOVIE_TALK: '/movie-talk',
  MOVIE_TALK_DETAIL: '/movie-talk/:makerId',
  GENRE: {
    ROOT: '/genre', // 슬래시 포함
    DETAIL: ':genre', // 상대 경로
    RECOMMENDATIONS: 'recommendations', // 상대 경로
  },
  COMMERCIAL: '/commercial',
  LOGIN: '/login',
  SIGN_UP: '/sign-up',
  MOVIE_DETAIL: {
    ROOT: '/movies/:movieId',
    RATINGS: 'ratings',
    REVIEWS: {
      ROOT: 'reviews',
      DETAIL: ':reviewId',
    },
  },
  RATES: '/rates',
  INDIE_CINEMA: '/indie-cinema',
  SEARCH: '/search',
  SEARCH_MORE: '/search/more',
  NOTIFICATION: '/notification',
  MY_PAGE: {
    ROOT: '/mypage',
    RATINGS: 'ratings',
    REVIEWS: 'reviews',
    QNA: 'qna',
    COMMENTS: {
      ROOT: 'comments',
      REVIEW: 'review',
      QNA: 'qna',
    },
    LIKES: 'likes',
  },
  HOME_MORE: {
    RECOMMENDATIONS: '/home/recommendations',
  },
} as const;
