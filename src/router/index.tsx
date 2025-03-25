import { Routes, Route } from 'react-router';
import { ROUTES } from './routes';
import Home from '../pages/home/Home.tsx';
import MainLayout from "../layouts/MainLayout.tsx";
import GenreRecommendations from "../pages/genre-recommendations/GenreRecommendations.tsx";

const AppRoutes = () => {
  return (
      <MainLayout>
          <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.GENRE_RECOMMENDATIONS} element={<GenreRecommendations/>}/>
          </Routes>
      </MainLayout>
  );
};

export default AppRoutes;
