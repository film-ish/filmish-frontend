// routes.ts
export const ROUTES = {
  HOME: '/',
  MOVIE_TALK: '/movie-talk',
  MOVIE_TALK_DETAIL: '/movie-talk/:id',
  GENRE: {
    ROOT: '/genre', // 슬래시 포함
    DETAIL: ':genre', // 상대 경로
    RECOMMENDATIONS: 'recommendations' // 상대 경로
  },
  COMMERCIAL: '/commercial',
  LOGIN: '/login',
  SIGN_UP: '/sign-up',
  HOME_MORE: {
    RECOMMENDATIONS: '/home/recommendations',
    TOP_RATED: '/home/top-rated',
    TOP_LIKED: '/home/top-liked'
  }
} as const;