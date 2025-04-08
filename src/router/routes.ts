// routes.ts
export const ROUTES = {
  HOME: '/',
  MOVIE_TALK: '/movie-talk',
  MOVIE_TALK_DETAIL: '/movie-talk/:id',
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
  RATING_RECOMMENDATION: '/rating-recommendation',
  INDIE_CINEMA: '/indie-cinema',
  SEARCH: '/search',
  NOTIFICATION: '/notification',
  MY_PAGE: {
    ROOT: '/mypage',
    RATINGS: 'ratings',
    REVIEWS: 'reviews',
    QNA: 'qna',
    COMMENTS: 'comments',
    LIKES: 'likes',
  },
  HOME_MORE: {
    RECOMMENDATIONS: '/home/recommendations',
    TOP_RATED: '/home/top-rated',
<<<<<<< Updated upstream
    TOP_LIKED: '/home/top-liked',
  },
} as const;
=======
    TOP_LIKED: '/home/top-liked'
  },
  SEARCH: '/search',
} as const;
>>>>>>> Stashed changes
