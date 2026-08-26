import { configureStore } from '@reduxjs/toolkit';
// import { offline } from '@redux-offline/redux-offline'
// import offlineConfig from '@redux-offline/redux-offline/lib/defaults'

import { newsApi, newsReducer } from '@/entities';

export const store = configureStore({
  reducer: {
    [newsApi.reducerPath]: newsApi.reducer,
    newsSlice: newsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(newsApi.middleware),
  // enhancers: (getDefaultEnhancers) =>
  //   getDefaultEnhancers().concat(offline(offlineConfig)),
});
