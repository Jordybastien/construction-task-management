import { Routes, Route } from 'react-router';
import LoginPage from '@/pages/loginPage';
import HomePage from '@/pages/homePage';
import ProjectDetailsPage from '@/pages/projectDetailsPage';
import NotFoundPage from '@/pages/notFoundPage';
import AuthenticatedLayout from '@/layouts/authenticatedLayout';
import AuthLayout from '@/layouts/unAuthenticatedLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<LoginPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />

      <Route element={<AuthenticatedLayout />}>
        <Route path="home" element={<HomePage />} />
        <Route path="project/:id" element={<ProjectDetailsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
