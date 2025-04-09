import { Routes, Route, Navigate } from 'react-router';
import { ROUTES } from './routes';
import Home from '../pages/home/Home.tsx';
import MovieTalk from '../pages/movie-talk/MovieTalk.tsx';
import MainLayout from '../layouts/MainLayout.tsx';
import List from '../pages/genre/List.tsx';
import Detail from '../pages/genre/Detail.tsx';
import Recommendations from '../pages/genre/Recommendations.tsx';
import MovieTalkDetail from '../pages/movie-talk/movie-talk-detail/MovieTalkDetail.tsx';
import Login from '../pages/login/Login.tsx';
import SignUp from '../pages/sign-up/SignUp.tsx';
import MovieDetailLayout from '../layouts/MovieDetailLayout.tsx';
import DetailPage from '../pages/movie-detail/DetailPage.tsx';
import MovieRatingsPage from '../pages/movie-detail/RatingsPage.tsx';
import MovieReviewsPage from '../pages/movie-detail/review/MovieReviewsPage.tsx';
import ReviewDetailPage from '../pages/movie-detail/review/ReivewDetailPage.tsx';

import HomeRecommendations from '../pages/home/more/HomeRecommendations.tsx';
import CommercialMain from '../pages/commercial';
import Search from '../pages/search/Search';
import SearchMore from '../pages/search/SearchMore';
import MyPageLayout from '../layouts/MyPageLayout.tsx';
import RatingsPage from '../pages/my-page/RatingsPage.tsx';
import QnaPage from '../pages/my-page/QnaPage.tsx';
import LikePage from '../pages/my-page/LikePage.tsx';
import MyReviewsPage from '../pages/my-page/ReviewsPage.tsx';
import Rate from '../pages/rate';
import ReviewCommentsPage from '../pages/my-page/ReviewCommentsPage.tsx';
import QnaCommentsPage from '../pages/my-page/QnaCommentsPage.tsx';

const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.MOVIE_TALK} element={<MovieTalk />} />
        <Route path={ROUTES.MOVIE_TALK_DETAIL} element={<MovieTalkDetail />} />
        <Route path={ROUTES.SEARCH} element={<Search />} />
        <Route path={ROUTES.SEARCH_MORE} element={<SearchMore />} />

        <Route path={ROUTES.GENRE.ROOT}>
          <Route index element={<List />} />
          <Route path={ROUTES.GENRE.DETAIL} element={<Detail />} />
          <Route path={`${ROUTES.GENRE.DETAIL}/${ROUTES.GENRE.RECOMMENDATIONS}`} element={<Recommendations />} />
        </Route>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        <Route path={ROUTES.COMMERCIAL} element={<CommercialMain />} />

        <Route path={ROUTES.MOVIE_DETAIL.ROOT} element={<MovieDetailLayout />}>
          <Route index element={<DetailPage />} />
          <Route path={ROUTES.MOVIE_DETAIL.RATINGS} element={<MovieRatingsPage />} />
          <Route path={ROUTES.MOVIE_DETAIL.REVIEWS.ROOT} element={<MovieReviewsPage />}>
            <Route path={ROUTES.MOVIE_DETAIL.REVIEWS.DETAIL} element={<ReviewDetailPage />} />
          </Route>
        </Route>

        {/* 홈 더보기 페이지 라우트 */}
        <Route path={ROUTES.HOME_MORE.RECOMMENDATIONS} element={<HomeRecommendations />} />

        <Route path={ROUTES.MY_PAGE.ROOT} element={<MyPageLayout />}>
          <Route index element={<Navigate to={ROUTES.MY_PAGE.RATINGS} replace />} />
          <Route path={ROUTES.MY_PAGE.RATINGS} element={<RatingsPage />} />
          <Route path={ROUTES.MY_PAGE.REVIEWS} element={<MyReviewsPage />} />
          <Route path={ROUTES.MY_PAGE.QNA} element={<QnaPage />} />

          <Route path={ROUTES.MY_PAGE.COMMENTS.ROOT}>
            <Route index element={<Navigate to={ROUTES.MY_PAGE.COMMENTS.REVIEW} replace />} />
            <Route path={ROUTES.MY_PAGE.COMMENTS.REVIEW} element={<ReviewCommentsPage />} />
            <Route path={ROUTES.MY_PAGE.COMMENTS.QNA} element={<QnaCommentsPage />} />
          </Route>

          <Route path={ROUTES.MY_PAGE.LIKES} element={<LikePage />} />
        </Route>
        <Route path={ROUTES.RATES} element={<Rate />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;
