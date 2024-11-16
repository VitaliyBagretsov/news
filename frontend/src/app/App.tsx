import React, { Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useDispatch } from '../shared/utils/store.util';
import { loadMedia } from '../entities/slice';
import { useGetMediaQuery } from '../entities/news.entity';

const Media = React.lazy(() => import('../pages/media/media'));
const News = React.lazy(() => import('../pages/news'));

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
  }, [data]);

  return (
    <HashRouter>
      <Routes>
        <Route
          path='*'
          element={
            <Layout>
              <Media />
            </Layout>
          }
        />
        <Route
          path='news/:id'
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
