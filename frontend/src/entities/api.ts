import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IMedia, INews, QueryResult } from './types';
import { IQuery } from '../shared/types';

const parceQuery = (query: IQuery<INews>): string => {
  const result = [
    `filter[mediaId]=${query?.filter?.id}`,
    `sort[date]=${query?.sort?.date}`,
    `page=${query?.page}`,
    `limit=${query?.limit}`,
  ];
  return result.join('&');
};

const baseUrl = `${import.meta.env.VITE_API}`

// Define a service using a base URL and expected endpoints
export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getMedia: build.query<QueryResult<IMedia>, void>({
      query: () => `media`,
    }),

    getNews: build.query<QueryResult<INews>, IQuery<INews>>({
      query: (query) => `news?${parceQuery(query)}`,
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetMediaQuery, useGetNewsQuery } = newsApi;
