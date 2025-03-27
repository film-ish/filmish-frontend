import {Routes, Route} from 'react-router';
import {ROUTES} from './routes';
import Home from '../pages/home/Home.tsx';
import MainLayout from "../layouts/MainLayout.tsx";
import List from "../pages/genre/List.tsx";
import Detail from "../pages/genre/Detail.tsx";
import Recommendations from "../pages/genre/Recommendations.tsx";

const AppRoutes = () => {
    return (
        <MainLayout>
            <Routes>
                <Route path={ROUTES.HOME} element={<Home/>}/>

                <Route path={ROUTES.GENRE.ROOT}>
                    <Route index element={<List/>}/>
                    <Route path={ROUTES.GENRE.DETAIL} element={<Detail/>}/>
                    <Route path={`${ROUTES.GENRE.DETAIL}/${ROUTES.GENRE.RECOMMENDATIONS}`} element={<Recommendations/>}/>
                </Route>
            </Routes>
        </MainLayout>
    );
};

export default AppRoutes;