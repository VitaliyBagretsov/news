import React, { Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { loadMedia, useGetMediaQuery } from '@/entities';
import { useDispatch } from '@/shared/utils/store.util';

const Media = React.lazy(() => import('@/pages/media/media'));
const News = React.lazy(() => import('@/pages/news'));

interface LayoutProps {
  children: JSX.Element;
}

const Layout = ({ children }: LayoutProps) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};
function App() {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching } = useGetMediaQuery();

  useEffect(() => {
    if (isLoading || isFetching) return;
    dispatch(loadMedia(data));
  }, [data, dispatch, isFetching, isLoading]);

  return (
    <HashRouter>
      <Routes>
        <Route
          path="*"
          element={
            <Layout>
              <Media />
            </Layout>
          }
        />
        <Route
          path="news/:id"
          element={
            <Layout>
              <News />
            </Layout>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
