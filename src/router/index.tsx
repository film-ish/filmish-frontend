import { Routes, Route } from 'react-router';
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
<<<<<<< Updated upstream
import CommercialMain from '../pages/commercial';
import MovieDetailLayout from '../layouts/MovieDetailLayout.tsx';
import DetailPage from '../pages/movie-detail/DetailPage.tsx';
import MovieRatingsPage from '../pages/movie-detail/RatingsPage.tsx';
import MovieReviewsPage from '../pages/movie-detail/review/MovieReviewsPage.tsx';
import ReviewDetailPage from '../pages/movie-detail/review/ReivewDetailPage.tsx';

import HomeRecommendations from '../pages/home/more/HomeRecommendations.tsx';
import HomeTopRated from '../pages/home/more/HomeTopRated.tsx';
import HomeTopLiked from '../pages/home/more/HomeTopLiked.tsx';
=======
import CommercialMain from "../pages/commercial";
import HomeRecommendations from "../pages/home/more/HomeRecommendations.tsx";
import HomeTopRated from "../pages/home/more/HomeTopRated.tsx";
import HomeTopLiked from "../pages/home/more/HomeTopLiked.tsx";
import Search from '../pages/search/Search';
>>>>>>> Stashed changes

const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.MOVIE_TALK} element={<MovieTalk />} />
        <Route path={ROUTES.MOVIE_TALK_DETAIL} element={<MovieTalkDetail />} />

<<<<<<< Updated upstream
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
        <Route path={ROUTES.HOME_MORE.TOP_RATED} element={<HomeTopRated />} />
        <Route path={ROUTES.HOME_MORE.TOP_LIKED} element={<HomeTopLiked />} />
      </Routes>
    </MainLayout>
  );
=======
                <Route path={ROUTES.GENRE.ROOT}>
                    <Route index element={<List />} />
                    <Route path={ROUTES.GENRE.DETAIL} element={<Detail />} />
                    <Route path={`${ROUTES.GENRE.DETAIL}/${ROUTES.GENRE.RECOMMENDATIONS}`} element={<Recommendations />} />
                </Route>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
                <Route path={ROUTES.COMMERCIAL} element={<CommercialMain/>}/>
                
                {/* 홈 더보기 페이지 라우트 */}
                <Route path={ROUTES.HOME_MORE.RECOMMENDATIONS} element={<HomeRecommendations />} />
                <Route path={ROUTES.HOME_MORE.TOP_RATED} element={<HomeTopRated />} />
                <Route path={ROUTES.HOME_MORE.TOP_LIKED} element={<HomeTopLiked />} />

                <Route path={ROUTES.SEARCH} element={<Search />} />
            </Routes>
        </MainLayout>
    );
>>>>>>> Stashed changes
};

export default AppRoutes;
