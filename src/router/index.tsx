import { Routes, Route } from 'react-router';
import { ROUTES } from './routes';
import Home from '../pages/home/Home.tsx';
import MainLayout from "../layouts/MainLayOut.tsx";

const AppRoutes = () => {
  return (
      <MainLayout>
          <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
          </Routes>
      </MainLayout>
  );
};

export default AppRoutes;
