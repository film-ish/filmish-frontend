import { Routes, Route } from 'react-router';
import { ROUTES } from './routes';
import Home from '../pages/home/Home.tsx';
import MovieTalk from '../pages/movie-talk/MovieTalk.tsx';
import MainLayout from '../layouts/MainLayout';

const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.MOVIE_TALK} element={<MovieTalk />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;
