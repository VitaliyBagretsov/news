import { configureStore } from '@reduxjs/toolkit';
// import { offline } from '@redux-offline/redux-offline'
// import offlineConfig from '@redux-offline/redux-offline/lib/defaults'

import newsSlice from '../entities/slice';
import { newsApi } from '../entities/news.entity';

export const store = configureStore({
  reducer: {
    [newsApi.reducerPath]: newsApi.reducer,
    newsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(newsApi.middleware),
  // enhancers: (getDefaultEnhancers) =>
  //   getDefaultEnhancers().concat(offline(offlineConfig)),
});
