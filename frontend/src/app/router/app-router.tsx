import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { routePaths } from '@/shared/config';

import { ProtectedRoute } from './protected-route';

const HomePage = lazy(() => import('@/pages/home'));
const LoginPage = lazy(() => import('@/pages/login'));
const MediaPage = lazy(() => import('@/pages/media'));
const NewsPage = lazy(() => import('@/pages/news'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));
const RootPage = lazy(() => import('@/pages/root'));

export const AppRouter = () => (
  <Suspense fallback={<Spin fullscreen size="large" />}>
    <Routes>
      <Route path={routePaths.login} element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<RootPage />}>
          <Route index element={<HomePage />} />
          <Route path={routePaths.media} element={<MediaPage />} />
          <Route path={routePaths.news} element={<NewsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);
