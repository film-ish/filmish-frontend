import { Routes, Route } from 'react-router';
import { ROUTES } from './routes';
import Home from '../pages/home/Home.tsx';
import MovieTalk from '../pages/movie-talk/MovieTalk.tsx';
import MainLayout from '../layouts/MainLayout.tsx';
import List from "../pages/genre/List.tsx";
import Detail from "../pages/genre/Detail.tsx";
import Recommendations from "../pages/genre/Recommendations.tsx";
import MovieTalkDetail from '../pages/movie-talk/movie-talk-detail/MovieTalkDetail.tsx';
import Login from '../pages/login/Login.tsx';
import SignUp from '../pages/sign-up/SignUp.tsx';
const AppRoutes = () => {
    return (
        <MainLayout>
            <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.MOVIE_TALK} element={<MovieTalk />} />
                <Route path={ROUTES.MOVIE_TALK_DETAIL} element={<MovieTalkDetail />} />

                <Route path={ROUTES.GENRE.ROOT}>
                    <Route index element={<List />} />
                    <Route path={ROUTES.GENRE.DETAIL} element={<Detail />} />
                    <Route path={`${ROUTES.GENRE.DETAIL}/${ROUTES.GENRE.RECOMMENDATIONS}`} element={<Recommendations />} />
                </Route>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
            </Routes>
        </MainLayout>
    );
};

export default AppRoutes;