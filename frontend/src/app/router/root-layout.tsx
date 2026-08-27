import { Alert, Spin } from 'antd';
import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useMediaQuery, useMediaStore } from '@/entities/media';

export const RootLayout = () => {
  const setMedia = useMediaStore((state) => state.setMedia);
  const { data, isError, isPending } = useMediaQuery();

  useEffect(() => {
    if (data) setMedia(data.data);
  }, [data, setMedia]);

  if (isPending) return <Spin fullscreen size="large" />;
  if (isError) {
    return <Alert message="Не удалось загрузить список медиа" type="error" />;
  }

  return (
    <Suspense fallback={<Spin fullscreen size="large" />}>
      <Outlet />
    </Suspense>
  );
};
