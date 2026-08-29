import { In, ILike } from 'typeorm';

import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../../constants/news.const.js';
import { QueryDto } from '../../dto/query.dto.js';

export const calculateSkip = (pageNumber: number, perPage: number): number =>
  pageNumber
    ? pageNumber * (perPage ?? DEFAULT_LIMIT) - perPage
    : DEFAULT_OFFSET;

export const getWhereFromQuery = (filter) =>
  filter
    ? Object.entries(filter).reduce(
        (result, [key, value]) => ({
          ...result,
          [`${key}`]: Array.isArray(value) ? In(value) : value,
        }),
        {},
      )
    : {};

export const getSearchFromQuery = (search: any) =>
  search
    ? Object.entries(search).reduce(
        (result, [key, value]) => ({
          ...result,
          [`${key}`]: Array.isArray(value)
            ? In(value.map((element) => ILike(`%${element}%`)))
            : ILike(`%${value}%`),
        }),
        {},
      )
    : {};

export const getSortFromQuery = (sort: any) =>
  sort
    ? Object.entries(sort).reduce(
        (result, [key, value]) => ({ ...result, [`"${key}"`]: value }),
        {},
      )
    : {};

const wrapColumnsToEscaping = (columns: (string | number | symbol)[]): string =>
  columns.reduce(
    (result, column) =>
      result
        ? `${result.toString()}, "${column.toString()}"`
        : `"${column.toString()}"`,
    '',
  ) as string;

export const prepareQuery = (query: QueryDto) => ({
  limit: query.limit ?? DEFAULT_LIMIT,
  skip: calculateSkip(query.page, query.limit),
  where: getWhereFromQuery(query.filter),
  search: getSearchFromQuery(query.search),
  sort: getSortFromQuery(query.sort),
  select: query.columns ? wrapColumnsToEscaping(query.columns) : '',
});
