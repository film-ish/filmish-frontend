// routes.ts
export const ROUTES = {
  HOME: '/',
  MOVIE_TALK: '/movie-talk',
  GENRE: {
    ROOT: '/genre', // 슬래시 포함
    DETAIL: ':genre', // 상대 경로
    RECOMMENDATIONS: 'recommendations' // 상대 경로
  }
} as const;