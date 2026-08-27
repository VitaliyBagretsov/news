import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { routePaths } from '@/shared/config';

import { RootLayout } from './root-layout';

const MediaPage = lazy(() => import('@/pages/media'));
const NewsPage = lazy(() => import('@/pages/news'));

export const AppRouter = () => (
  <Routes>
    <Route element={<RootLayout />}>
      <Route index path={routePaths.media} element={<MediaPage />} />
      <Route path={routePaths.news} element={<NewsPage />} />
    </Route>
    <Route path="*" element={<Navigate replace to={routePaths.media} />} />
  </Routes>
);
