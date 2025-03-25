import { Routes, Route } from 'react-router';
import { ROUTES } from './routes';
import Home from '../pages/home/Home.tsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
